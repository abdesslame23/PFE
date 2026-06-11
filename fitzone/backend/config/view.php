<?php

return [
    /*
    |--------------------------------------------------------------------------
    | View Storage Paths
    |--------------------------------------------------------------------------
    |
    | Here you may specify an array of paths that should be checked for your
    | views. Of course, the usual Laravel view path has already been placed
    | for you.
    |
    */

    'paths' => [
        resource_path('views'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Compiled View Path
    |--------------------------------------------------------------------------
    |
    | This option determines where all the compiled Blade templates will be
    | stored for your application. Typically, this is within the storage
    | directory. Make sure this folder is writable by the web server.
    |
    */

    'compiled' => env('VIEW_COMPILED_PATH', storage_path('framework/views')),

    'compiled_extension' => 'php',
];
