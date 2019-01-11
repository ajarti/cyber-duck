<?php

namespace App\Http\Controllers;

use DB;
use Exception;
use JavaScript;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     *
     * Access to Request Object.
     *
     * @var Request
     */
    protected $request;

    /**
     *
     * The current model.
     *
     * @var Model
     */
    protected $model;

    /**
     *
     * Current Paginator.
     *
     */
    protected $paginator = [];

    /**
     *
     * Set how many per page.
     *
     * @var Int
     */
    protected $perPage = 10;

    /**
     *
     * The sort order.
     *
     * @var array
     */
    protected $sortOrder;

    /**
     *
     * Array of relationships to lazy load.
     *
     * @var array
     */
    protected $withs = [];

    /**
     *
     * Boolean include soft deleted items?
     *
     * @var boolean
     */
    protected $withDeleted;


    /**
     *
     * Create a new controller instance.
     *
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;

        // Set defaults.
        $this->setWithDeleted(false);

    }


    /**
     *
     * Return the paginated data fro the query.
     *
     * @param $query
     *
     * @return mixed
     */
    final public function getPaginatedData($query)
    {
        $data = $query->paginate($this->perPage());

        // Customised to Vuetify v-data-table pagination.sync format.
        $this->paginator = [
            'descending'  => true,
            'page'        => $data->currentPage(),
            'rowsPerPage' => $data->perPage(),
            'sortBy'      => '',
            'totalItems'  => $data->total()
        ];

        return $data;
    }


    /**
     *
     * Returns a new instance of the model.
     *
     * @return mixed
     *
     */
    final public function newModel()
    {
        $class_name = get_class($this->model);
        return new $class_name();
    }


    /**
     *
     * Make a new instance of the entity to query on with options including withs, pagination and deleted.
     *
     * @return Model | null
     *
     */
    final public function newQuery()
    {
        // Start Query.
        $query = $this->model->with($this->withs());

        // Check for deleted.
        $query = $this->withDeleted() ? $query->withTrashed() : $query;

        return $query;
    }


    /**
     *
     * Returns the current per page setting.
     *
     * @return int
     *
     */
    final public function perPage()
    {
        return $this->perPage;
    }


    /**
     *
     * Sends a 200 status JSON message.
     *
     * @param null|array $message
     * @param null|array $extras
     * @param int        $returnCode
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    final public function sendAjaxMessage($message = null, $extras = null, $returnCode = 200, $status = 'success')
    {
        // Check we have a message.
        if ( is_null($message) || !is_array($message) ) {
            throw new Exception('sendAjaxMessage requires a message.');
        }

        // Set message holder array;
        $data = [];
        $data['status'] = $status;
        foreach ( $message as $key => $value ) {
            $data['messages'][$key][] = $value;
        }

        // Check for extras.
        if ( isset($extras) && is_array($extras) ) {
            foreach ( $extras as $key => $val ) {
                $data[$key] = $val;
            }
        }

        // Return the JSON response.
        return response()->json($data, $returnCode);
    }


    /**
     *
     * Sends a 422 status JSON message.
     *
     * @param null|array $message
     *
     * @param null       $extras
     * @param int        $errorCode
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    final public function sendAjaxError($message = null, $extras = null, $errorCode = 422)
    {
        // Return the JSON response, setting type to error.
        return $this->sendAjaxMessage($message, $extras, $errorCode, 'error');
    }


    /**
     *
     * Sets the current per page setting.
     *
     * @param int $perPage
     *
     * @return $this
     *
     */
    final public function setPerPage(int $perPage = 20)
    {
        if ( is_numeric($perPage) && ( $perPage > 0 ) ) {
            $this->perPage = $perPage;
        }
        return $this;
    }


    /**
     *
     * Sets the relations.
     *
     * @param array $withs
     *
     * @return $this
     *
     */
    final public function setWiths(array $withs = [])
    {
        if ( is_array($withs) ) {
            $this->withs = $withs;
        }
        return $this;
    }


    /**
     *
     * Sets if soft deleted records should also be returned.
     *
     * @param bool $withDeleted
     *
     * @return $this
     *
     */
    final public function setWithDeleted($withDeleted = false)
    {
        if ( is_bool($withDeleted) ) {
            $this->withDeleted = $withDeleted;
        }
        return $this;
    }


    /**
     *
     * Determines if soft deleted records should also be returned.
     *
     * @return Boolean
     *
     */
    final public function withDeleted()
    {
        return $this->withDeleted;
    }


    /**
     *
     * Returns the includes.
     *
     * @return array
     *
     */
    final public function withs()
    {
        return ( is_array($this->withs) ) ? $this->withs : [];
    }
}
