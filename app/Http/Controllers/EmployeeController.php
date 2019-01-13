<?php

namespace App\Http\Controllers;

use App\Employee;
use Illuminate\Http\Request;
use App\Http\Resources\EmployeeTransformer;
use App\Http\Requests\EmployeeSearchRequest;
use App\Http\Requests\DeleteEmployeeRequest;

class EmployeeController extends Controller
{

    /**
     *
     * EmployeeController constructor.
     *
     * @param Request  $request
     * @param Employee $employee
     */
    public function __construct(Request $request, Employee $employee)
    {
        parent::__construct($request);
        $this->model = $employee;
    }


    /**
     * Remove the specified resource from storage. (Not destroy, soft delete)
     *
     * @param DeleteEmployeeRequest $request
     * @param  \App\Employee        $employee
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function delete(DeleteEmployeeRequest $request, Employee $employee)
    {
        $employee = $employee->find($request->get('id', 0));

        // Make sure we have a employee.
        if ( is_a($employee, Employee::class) ) {
            if ( $employee->delete() ) {
                return $this->sendAjaxMessage(['message' => $employee->first_name . ' was deleted successfully']);
            } else {
                return $this->sendAjaxError(['message' => 'Oops, we could not delete that employee something unkosher occurred']);
            }
        } else {
            return $this->sendAjaxError(['message' => 'We could not delete that employee as we could not locate them in the database']);
        }
    }


    /**
     * Search the resource.
     *
     * @param EmployeeSearchRequest $request
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function search(EmployeeSearchRequest $request)
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
        $this->setWiths(['company']);

        // Check for q (query)
        if ( !empty($q) ) {

            $query
                ->where('first_name', 'LIKE', '%' . $q . '%')
                ->orWhere('last_name', 'LIKE', '%' . $q . '%')
                ->orWhere('email', 'LIKE', '%' . $q . '%')
                ->orWhere('phone', 'LIKE', '%' . $q . '%');

            // Check Company Name.
            $query->orWhereHas('company', function ($query) use ($q) {
                $query->where('name', 'like', '%' . $q . '%');
            });
        }

        // Latest
        $query->latest();

        // Get data & setup Paginator data.
        $data = $this->getPaginatedData($query);

        // Return the matched companies.
        return $this->sendAjaxMessage([], [
            'pagination' => $this->paginator,
            'status'     => 'success',
            'employees'  => EmployeeTransformer::collection($data),
        ]);
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Employee $employee
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Employee $employee)
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
    public function update(Request $request, Employee $employee)
    {
        //
    }
}
