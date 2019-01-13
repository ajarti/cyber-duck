<?php

namespace App\Http\Controllers;

use App\Company;
use Illuminate\Http\Request;
use App\Http\Requests\DeleteCompanyRequest;
use App\Http\Requests\RestoreCompanyRequest;
use App\Http\Resources\CompanyTransformer;
use App\Http\Requests\CompanySearchRequest;


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
                return $this->sendAjaxMessage(['message' => $company->name . ' was deleted successfully']);
            } else {
                return $this->sendAjaxError(['message' => 'Oops, we could not delete that company something unkosher occurred']);
            }
        } else {
            return $this->sendAjaxError(['message' => 'We could not delete that company as we could not locate it in the database']);
        }
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
                return $this->sendAjaxMessage(['message' => $company->name . ' was restored successfully']);
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
     * Display the specified resource.
     *
     * @param  \App\Company $company
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Company $company)
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Company             $company
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Company $company)
    {
        //
    }

    public function uploadLogo(Request $request)
    {
        dd('Uploading ...');
    }

}
