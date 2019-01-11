<?php

namespace App\Http\Controllers;

use App\Company;
use Illuminate\Http\Request;
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
     * Remove the specified resource from storage. (Not destroy, soft delete)
     *
     * @param  \App\Company $company
     *
     * @return \Illuminate\Http\Response
     */
    public function delete(Company $company)
    {
        //
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

}
