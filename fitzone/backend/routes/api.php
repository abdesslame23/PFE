<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CoursController;
use App\Http\Controllers\Api\AbonneController;
use App\Http\Controllers\Api\SalleController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\PointageController;

Route::get('/', function () {
    return response()->json(['message' => 'Backend API en marche']);
});

// Auth public
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// Cours publics (lecture)
Route::get('cours',     [CoursController::class, 'index']);
Route::get('cours/{id}',[CoursController::class, 'show']);

// Routes protégées JWT
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('logout',         [AuthController::class, 'logout']);
        Route::get('me',              [AuthController::class, 'me']);
        Route::put('profile',         [AuthController::class, 'updateProfile']);
    });

    // Paiements (abonne = les siens, admin = tous)
    Route::prefix('paiements')->group(function () {
        Route::get('/',           [PaiementController::class, 'index']);
        Route::get('recap',       [PaiementController::class, 'recapAnnuel']);
        Route::get('gestion',     [PaiementController::class, 'gestionPaiements'])->middleware('admin');
        Route::post('mensuel',    [PaiementController::class, 'marquerPaiementMensuel'])->middleware('admin');
        Route::post('annuel',     [PaiementController::class, 'validerAnneeEntiere'])->middleware('admin');
        Route::post('{id}/payer', [PaiementController::class, 'marquerPaye']);
        Route::post('store',      [PaiementController::class, 'store'])->middleware('admin');
        Route::put('{id}',        [PaiementController::class, 'update'])->middleware('admin');
        Route::delete('{id}',     [PaiementController::class, 'destroy'])->middleware('admin');
    });

    // Inscription / désinscription aux cours
    Route::post('cours/{id}/inscrire',    [CoursController::class, 'inscrire']);
    Route::delete('cours/{id}/desinscrire',[CoursController::class, 'desinscrire']);

    // Admin seulement
    Route::middleware('admin')->group(function () {
        // CRUD Cours
        Route::post('cours',       [CoursController::class, 'store']);
        Route::put('cours/{id}',   [CoursController::class, 'update']);
        Route::delete('cours/{id}',[CoursController::class, 'destroy']);

        // CRUD Salles
        Route::apiResource('salles', SalleController::class);

        // CRUD Abonnés
        Route::get('abonnes/stats',          [AbonneController::class, 'stats']);
        Route::get('abonnes',                [AbonneController::class, 'index']);
        Route::get('abonnes/{id}',           [AbonneController::class, 'show']);
        Route::post('abonnes',               [AbonneController::class, 'store']);
        Route::put('abonnes/{id}',           [AbonneController::class, 'update']);
        Route::delete('abonnes/{id}',        [AbonneController::class, 'destroy']);
        Route::post('abonnes/{id}/visite',   [AbonneController::class, 'ajouterVisite']);

        Route::post('pointage/valider',     [PointageController::class, 'validerCode']);
        Route::get('pointage/aujourd-hui',  [PointageController::class, 'pointagesDuJour']);
    });

    // Code abonné
      Route::get('pointage/mon-code', [PointageController::class, 'monCode']);
});
