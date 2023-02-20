package com.victorpule.germoplasma.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.victorpule.germoplasma.IntegrationTest;
import com.victorpule.germoplasma.domain.Planta;
import com.victorpule.germoplasma.repository.PlantaRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PlantaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlantaResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_ESTADO = "AAAAAAAAAA";
    private static final String UPDATED_ESTADO = "BBBBBBBBBB";

    private static final String DEFAULT_USO = "AAAAAAAAAA";
    private static final String UPDATED_USO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/plantas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PlantaRepository plantaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlantaMockMvc;

    private Planta planta;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Planta createEntity(EntityManager em) {
        Planta planta = new Planta().nombre(DEFAULT_NOMBRE).estado(DEFAULT_ESTADO).uso(DEFAULT_USO);
        return planta;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Planta createUpdatedEntity(EntityManager em) {
        Planta planta = new Planta().nombre(UPDATED_NOMBRE).estado(UPDATED_ESTADO).uso(UPDATED_USO);
        return planta;
    }

    @BeforeEach
    public void initTest() {
        planta = createEntity(em);
    }

    @Test
    @Transactional
    void createPlanta() throws Exception {
        int databaseSizeBeforeCreate = plantaRepository.findAll().size();
        // Create the Planta
        restPlantaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(planta)))
            .andExpect(status().isCreated());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeCreate + 1);
        Planta testPlanta = plantaList.get(plantaList.size() - 1);
        assertThat(testPlanta.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testPlanta.getEstado()).isEqualTo(DEFAULT_ESTADO);
        assertThat(testPlanta.getUso()).isEqualTo(DEFAULT_USO);
    }

    @Test
    @Transactional
    void createPlantaWithExistingId() throws Exception {
        // Create the Planta with an existing ID
        planta.setId(1L);

        int databaseSizeBeforeCreate = plantaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlantaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(planta)))
            .andExpect(status().isBadRequest());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlantas() throws Exception {
        // Initialize the database
        plantaRepository.saveAndFlush(planta);

        // Get all the plantaList
        restPlantaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(planta.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO)))
            .andExpect(jsonPath("$.[*].uso").value(hasItem(DEFAULT_USO)));
    }

    @Test
    @Transactional
    void getPlanta() throws Exception {
        // Initialize the database
        plantaRepository.saveAndFlush(planta);

        // Get the planta
        restPlantaMockMvc
            .perform(get(ENTITY_API_URL_ID, planta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(planta.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO))
            .andExpect(jsonPath("$.uso").value(DEFAULT_USO));
    }

    @Test
    @Transactional
    void getNonExistingPlanta() throws Exception {
        // Get the planta
        restPlantaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlanta() throws Exception {
        // Initialize the database
        plantaRepository.saveAndFlush(planta);

        int databaseSizeBeforeUpdate = plantaRepository.findAll().size();

        // Update the planta
        Planta updatedPlanta = plantaRepository.findById(planta.getId()).get();
        // Disconnect from session so that the updates on updatedPlanta are not directly saved in db
        em.detach(updatedPlanta);
        updatedPlanta.nombre(UPDATED_NOMBRE).estado(UPDATED_ESTADO).uso(UPDATED_USO);

        restPlantaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlanta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPlanta))
            )
            .andExpect(status().isOk());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeUpdate);
        Planta testPlanta = plantaList.get(plantaList.size() - 1);
        assertThat(testPlanta.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testPlanta.getEstado()).isEqualTo(UPDATED_ESTADO);
        assertThat(testPlanta.getUso()).isEqualTo(UPDATED_USO);
    }

    @Test
    @Transactional
    void putNonExistingPlanta() throws Exception {
        int databaseSizeBeforeUpdate = plantaRepository.findAll().size();
        planta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlantaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, planta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(planta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlanta() throws Exception {
        int databaseSizeBeforeUpdate = plantaRepository.findAll().size();
        planta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(planta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlanta() throws Exception {
        int databaseSizeBeforeUpdate = plantaRepository.findAll().size();
        planta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(planta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlantaWithPatch() throws Exception {
        // Initialize the database
        plantaRepository.saveAndFlush(planta);

        int databaseSizeBeforeUpdate = plantaRepository.findAll().size();

        // Update the planta using partial update
        Planta partialUpdatedPlanta = new Planta();
        partialUpdatedPlanta.setId(planta.getId());

        partialUpdatedPlanta.nombre(UPDATED_NOMBRE).uso(UPDATED_USO);

        restPlantaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlanta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlanta))
            )
            .andExpect(status().isOk());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeUpdate);
        Planta testPlanta = plantaList.get(plantaList.size() - 1);
        assertThat(testPlanta.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testPlanta.getEstado()).isEqualTo(DEFAULT_ESTADO);
        assertThat(testPlanta.getUso()).isEqualTo(UPDATED_USO);
    }

    @Test
    @Transactional
    void fullUpdatePlantaWithPatch() throws Exception {
        // Initialize the database
        plantaRepository.saveAndFlush(planta);

        int databaseSizeBeforeUpdate = plantaRepository.findAll().size();

        // Update the planta using partial update
        Planta partialUpdatedPlanta = new Planta();
        partialUpdatedPlanta.setId(planta.getId());

        partialUpdatedPlanta.nombre(UPDATED_NOMBRE).estado(UPDATED_ESTADO).uso(UPDATED_USO);

        restPlantaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlanta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlanta))
            )
            .andExpect(status().isOk());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeUpdate);
        Planta testPlanta = plantaList.get(plantaList.size() - 1);
        assertThat(testPlanta.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testPlanta.getEstado()).isEqualTo(UPDATED_ESTADO);
        assertThat(testPlanta.getUso()).isEqualTo(UPDATED_USO);
    }

    @Test
    @Transactional
    void patchNonExistingPlanta() throws Exception {
        int databaseSizeBeforeUpdate = plantaRepository.findAll().size();
        planta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlantaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, planta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(planta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlanta() throws Exception {
        int databaseSizeBeforeUpdate = plantaRepository.findAll().size();
        planta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(planta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlanta() throws Exception {
        int databaseSizeBeforeUpdate = plantaRepository.findAll().size();
        planta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(planta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Planta in the database
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlanta() throws Exception {
        // Initialize the database
        plantaRepository.saveAndFlush(planta);

        int databaseSizeBeforeDelete = plantaRepository.findAll().size();

        // Delete the planta
        restPlantaMockMvc
            .perform(delete(ENTITY_API_URL_ID, planta.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Planta> plantaList = plantaRepository.findAll();
        assertThat(plantaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
