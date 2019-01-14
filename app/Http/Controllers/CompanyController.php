<?php

namespace App\Http\Controllers;

use App\Company;
use App\Http\Requests\CompanySearchRequest;
use App\Http\Requests\CreateCompanyRequest;
use App\Http\Requests\DeleteCompanyRequest;
use App\Http\Requests\RestoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyTransformer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;


class CompanyController extends Controller
{

    /**
     *
     * CompanyController constructor.
     *
     * @param Request $request
     * @param Company $company
     */
    public function __construct(Request $request, Company $company)
    {
        parent::__construct($request);

        $this->model = $company;
    }


    /**
     * Remove the specified resource from the db. (Not destroy, soft delete)
     *
     * @param DeleteCompanyRequest $request
     * @param  \App\Company        $company
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function delete(DeleteCompanyRequest $request, Company $company)
    {
        $company = $company->find($request->get('id', 0));

        // Make sure we have a company.
        if ( is_a($company, Company::class) ) {
            if ( $company->delete() ) {

                // Cascade the soft delete to the employees (can also put on db event.)
                DB::table('employees')->whereCompanyId($company->id)->update(['deleted_at' => Carbon::now()]);

                return $this->sendAjaxMessage(['message' => $company->name . ' was deleted successfully. N.B. All employees at this company where also deleted']);
            } else {
                return $this->sendAjaxError(['message' => 'Oops, we could not delete that company something unkosher occurred']);
            }
        } else {
            return $this->sendAjaxError(['message' => 'We could not delete that company as we could not locate it in the database']);
        }
    }


    /**
     * @param $sourceFile
     * @param $newLogo
     *
     * @return bool
     */
    private function resizeLogos($sourceFileFullPath, $squareLogoFullPath, $newLogoFullPath, $squareOnly = true)
    {

        // Create blank canvas
        $img = Image::make($sourceFileFullPath);
        $bgColour = $img->pickColor(5, 5);

        // Determine layout portrait or landscape/square?
        if ( $img->width() < $img->height() ) {
            $heightPadded = round($img->height() * 1.3);
            $canvas = Image::canvas($heightPadded, $heightPadded, $bgColour);
            $canvas->insert($img, 'center');
        } else {
            $widthPadded = round($img->width() * 1.3);
            $canvas = Image::canvas($widthPadded, $widthPadded, $bgColour);
            $canvas->insert($img, 'center');
        }

        // Set canvas to 500px wide.
        $canvas->resize(500, null, function ($constraint) {
            $constraint->aspectRatio();
        });

        // Save square logo.
        $canvas->save($squareLogoFullPath);

        // Resize original logo.
        if ( !$squareOnly ) {
            $img->resize(500, null, function ($constraint) {
                $constraint->aspectRatio();
            });


            // Save original logo.
            $img->save($newLogoFullPath);
        }

        return true;

    }


    /**
     * Restore the specified resource from the db.
     *
     * @param RestoreCompanyRequest $request
     * @param  \App\Company         $company
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function restore(RestoreCompanyRequest $request, Company $company)
    {
        $company = $company->withTrashed()->find($request->get('id', 0));

        // Make sure we have a company.
        if ( is_a($company, Company::class) ) {
            if ( $company->restore() ) {
                return $this->sendAjaxMessage(['message' => $company->name . ' was restored successfully, N.B. you will need to restore the employees manually']);
            } else {
                return $this->sendAjaxError(['message' => 'Oops, we could not restore that company something unkosher occurred']);
            }
        } else {
            return $this->sendAjaxError(['message' => 'We could not restore that company as we could not locate it in the database']);
        }
    }


    /**
     * Search the resource.
     *
     * @param CompanySearchRequest $request
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function search(CompanySearchRequest $request)
    {
        // Setup
        $q = $request->get('q', '');

        // Set Per Page
        $this->setPerPage($request->get('per_page', 10));

        // Deleted?
        if ( $request->get('deleted', 0) ) {
            $this->setWithDeleted(true);
        }

        // Start query.
        $query = $this->newQuery();

        // Check for q (query)
        if ( !empty($q) ) {
            $query
                ->where('name', 'LIKE', '%' . $q . '%')
                ->orWhere('email', 'LIKE', '%' . $q . '%')
                ->orWhere('website', 'LIKE', '%' . $q . '%');
        }

        // Latest
        $query->latest();

        // Get data & setup Paginator data.
        $data = $this->getPaginatedData($query);

        // Return the matched companies.
        return $this->sendAjaxMessage([], [
            'pagination' => $this->paginator,
            'status'     => 'success',
            'companies'  => CompanyTransformer::collection($data),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCompanyRequest $request)
    {
        // Create a Company
        $company = $this->newModel();

        // Update Company
        if ( is_a($company, Company::class) ) {

            $company->fill($request->only([
                'email',
                'logo',
                'name',
                'website'
            ]));

            // Save it all.
            if ( $company->save() ) {

                // Check for new logo
                $newLogo = $request->get('new_logo', null);
                if ( !is_null($newLogo) && strlen($newLogo) ) {
                    $fileName = $this->updateLogo($request, $company);

                    // Check if anything failed.
                    if ( $fileName === false ) {
                        return $this->sendAjaxError([], [
                            'message' => 'We could not find the newly uploaded logo, please upload it again and try again or contact the admin to help.'
                        ]);
                    }

                    // All Ok.
                    $company->logo = $fileName;
                    $company->save();
                }

                return $this->sendAjaxMessage(
                    ['message' => $company->name . ' was created successfully.'],
                    [
                        'status'  => 'success',
                        'company' => new CompanyTransformer($company),
                    ]
                );
            }
        }

        // Something failed.
        return $this->sendAjaxError([], [
            'message' => 'We could not create this company, please try again'
        ]);


    }


    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCompanyRequest $request
     * @param  \App\Company        $company
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function update(UpdateCompanyRequest $request, Company $company)
    {
        // Get the Company
        $company = Company::find($request->get('id', 0));

        // Update Company
        if ( is_a($company, Company::class) ) {

            $company->fill($request->only([
                'email',
                'logo',
                'name',
                'website'
            ]));

            // Check if nothing changed.
            if ( !$company->isDirty() && empty($request->new_logo) ) {
                return $this->sendAjaxMessage(
                    ['message' => $company->name . ' was updated successfully.'],
                    ['status' => 'success']
                );
            }

            // Check for new logo
            $newLogo = $request->get('new_logo', null);
            if ( !is_null($newLogo) && strlen($newLogo) ) {
                $fileName = $this->updateLogo($request, $company);

                // Check if anything failed.
                if ( $fileName === false ) {
                    return $this->sendAjaxError([], [
                        'message' => 'We could not find the newly uploaded logo, please upload it again and try again or contact the admin to help.'
                    ]);
                }

                // All Ok.
                $company->logo = $fileName;
            }

            // Save it all.
            if ( $company->save() ) {
                return $this->sendAjaxMessage(
                    ['message' => $company->name . ' was updated successfully.'],
                    [
                        'status'  => 'success',
                        'company' => new CompanyTransformer($company),
                    ]
                );
            }
        }

        // Something failed.
        return $this->sendAjaxError([], [
            'message' => 'We could not update this company, please try again'
        ]);
    }


    /**
     *
     * Massage and move company logo.
     *
     * @param $request
     * @param $company
     *
     * @return bool|string
     */
    private function updateLogo($request, $company)
    {
        // Status
        $allOK = true;

        // Setup paths.
        $uploadPath = storage_path('app/public');
        $logosPath = storage_path('app/public') . '/logos/';
        $newLogoFile = 'logo_' . $company->id . '.png';
        $squareLogoFile = 'square_logo_' . $company->id . '.png';
        $uploadedLogoFullPath = $uploadPath . '/' . $request->get('new_logo', null);
        $squareLogoFullPath = $logosPath . $squareLogoFile;
        $newLogoFullPath = $logosPath . $newLogoFile;

        // Check file exists.

        if ( File::exists($uploadedLogoFullPath) ) {

            // Clear out old logo (different extensions);
            if ( isset($company->logo) && strlen($company->logo) && File::exists($logosPath . $company->logo) ) {
                try {
                    File::delete($logosPath . $company->logo);
                    if ( File::exists($squareLogoFullPath) ) {
                        File::delete($squareLogoFullPath);
                    }
                } catch ( \Exception $e ) {
                }
            }

            // Generate Resized logos (normal / square)
            $this->resizeLogos($uploadedLogoFullPath, $squareLogoFullPath, $newLogoFullPath, false);

            // Move in new logo.
            if ( File::exists($newLogoFullPath) ) {
                $company->logo = $newLogoFile;
                File::delete($uploadedLogoFullPath);
            } else {
                $allOK = false;
            }

        }

        // Return Status
        return $allOK ? $newLogoFile : false;

    }

}
