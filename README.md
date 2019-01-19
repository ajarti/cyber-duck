# Technical assignment for Cyber-Duck

Firstly many thanks for the opportunity to complete this exercise. I have deployed the application via Forge to a Digital Ocean server for your convenience, it can be accessed at [https://cyber-duck.ajarti.com](https://cyber-duck.ajarti.com)

## Task Requirements

**Use https://adminlte.io/ as a framework for the application**

I have used [Vuetify](https://vuetifyjs.com/), a Vue.js based css framework for the front end of the application bar the base Laravel login. This was OK'd with Danny & Gareth during our conference call.
I have created a simple SPA (Single Page Application) as opposed to the traditional post-back method to demonstrate some of the more modern methods of building responsive applications, with regards to both speed (i.e. how 'snappy' the application is) as well as how well the application adapts to different screen dimensions.

**Basic Laravel Auth: ability to log in as administrator**

As agreed this section of the application is defaulted to the basic version that is scaffolded when running the Artisan command 'make:auth'.   The routes and interfaces for the Register functionality have been removed and an attribute mutator (setPasswordAttribute) has been added to the user class to ensure all passwords are Hashed.

**Use database seeds to create first user with email admin@admin.com and password “password”**

Besides adding the requested admin user via seeding, I have also added 10 companies, each with 10 users. This was done to ensure pagination and searching are working correctly and to allow you to test this functionality without having to manually populate a decent number of records.

**CRUD functionality (Create / Read / Update / Delete) for two menu items: Companies and
Employees**

This has been completed as requested. I have ensured the delete functionality is in fact a soft delete with the ability to restore both companies and employees. It should be noted that deleting a company will cascade and delete all employees. The employees will NOT restore automatically when a company is restored as we do not have the functionality to discern which employees should be restored. To do this one could check the deleted_at date and restore any employees deleted after the company, but this may not meet the required functionality.  

**Companies DB table consists of these fields: Name (required), email, logo (minimum 100×100), website**

Fields created as requested, but I have increased the logo's minimum dimensions to 400px, logo's with small copy become indiscernible at 100px.

**Employees DB table consists of these fields: First name (required), last name (required),
Company (foreign key to Companies), email, phone**

Created as requested and the relationship added the companies/employees models.

**Use database migrations to create those schemas above**

Created with relevant indexes included.


**Store companies’ logos in storage/app/public folder and make them accessible from public**

I have changed the folder to storage/app/public/logos as a contingency. If the application was extended to include for example employee photos, we would want these files physically separated.
As mentioned, I have also deployed the application via forge and the symbolic link is created in the deployment script.
```bash
if [[ ! (-L "public/storage" && -d "$(readlink public/storage )") ]]; then
  php artisan storage:link
fi
```

**Use basic Laravel resource controllers with default methods – index, create, store etc.**

Resource controllers have been created, but as mentioned the application is an SPA and uses XHR, so the methods traditionally used in 'post back' applications, have been removed.

**Use Laravel’s validation function, using Request classes**

Request objects have been used to validate incoming requests, but we also have javascript validation on the frontend for an additional layer of protection.

**Use Laravel’s pagination for showing Companies/Employees list, 10 entries per page**

Laravel pagination has been used, but I have massaged the returned data to fit the requirements of the Vuetify datatable component. I have manually done this and I have not used a resource transformer for this function, but I have however used Resource Transformers for the Company/Employee responses.

**Use Laravel make:auth as default Bootstrap-based design theme, but remove ability to register.**

Completed as mentioned above. 


## Additional Functionality

I have included some functionality over and above the specification. These features are:

* I have created a custom Vue upload component that uses Uppy.js (A TUS protocol client that has automatic retries and allows the upload of very large files.) A PHP TUS server is included via composer.

* Logo's have 2 variants created on upload. The first is the original and the second is a 1:1 variant with the background set to the colour of the pixel at [5,5] of the original, this is used for listings and possible UI where a consistent layout would be required. The Intervention image manipulation package has been used for this. 

* Logos are proxied via a simple route that injects a placeholder should the base file not exists for some reason.

* The UI has a built in search that executes a debounced remote search and highlights matches on return. This also drives the filtered matching of employees from the company listing.  

* Company/Employee editing is done via modals to speed the process and retain position in the pagination. Listings are automatically reloaded on save.

* Delete and restore functions are available in context via the listing & editing interfaces.

* FAB buttons are used for editing action so as to de-clutter the interface and keep it as clean as possible.

N.B. This task does not included a test suite for brevity, should one be required please do not hesitate to ask.
