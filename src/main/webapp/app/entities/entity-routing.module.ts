import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'pais',
        data: { pageTitle: 'jhipsterBancoGermoplasmaApp.pais.home.title' },
        loadChildren: () => import('./pais/pais.module').then(m => m.PaisModule),
      },
      {
        path: 'provincia',
        data: { pageTitle: 'jhipsterBancoGermoplasmaApp.provincia.home.title' },
        loadChildren: () => import('./provincia/provincia.module').then(m => m.ProvinciaModule),
      },
      {
        path: 'canton',
        data: { pageTitle: 'jhipsterBancoGermoplasmaApp.canton.home.title' },
        loadChildren: () => import('./canton/canton.module').then(m => m.CantonModule),
      },
      {
        path: 'parroquia',
        data: { pageTitle: 'jhipsterBancoGermoplasmaApp.parroquia.home.title' },
        loadChildren: () => import('./parroquia/parroquia.module').then(m => m.ParroquiaModule),
      },
      {
        path: 'ubicacion',
        data: { pageTitle: 'jhipsterBancoGermoplasmaApp.ubicacion.home.title' },
        loadChildren: () => import('./ubicacion/ubicacion.module').then(m => m.UbicacionModule),
      },
      {
        path: 'planta',
        data: { pageTitle: 'jhipsterBancoGermoplasmaApp.planta.home.title' },
        loadChildren: () => import('./planta/planta.module').then(m => m.PlantaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
