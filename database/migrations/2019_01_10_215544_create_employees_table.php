<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->increments('id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique()->nullable()->default(null);
            $table->string('phone')->nullable()->default(null);
            $table->integer('company_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            // Cascade
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');

            // Add Index.
            $table->index('first_name');
            $table->index('last_name');
            $table->index('email');
            $table->index('phone');
            $table->index('company_id');

        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
}
