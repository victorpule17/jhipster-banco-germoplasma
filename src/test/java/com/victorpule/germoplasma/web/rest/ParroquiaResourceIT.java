package com.victorpule.germoplasma.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.victorpule.germoplasma.IntegrationTest;
import com.victorpule.germoplasma.domain.Parroquia;
import com.victorpule.germoplasma.repository.ParroquiaRepository;
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
 * Integration tests for the {@link ParroquiaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ParroquiaResourceIT {

    private static final String DEFAULT_NOMBRE_PARROQUIA = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_PARROQUIA = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/parroquias";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParroquiaRepository parroquiaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restParroquiaMockMvc;

    private Parroquia parroquia;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parroquia createEntity(EntityManager em) {
        Parroquia parroquia = new Parroquia().nombreParroquia(DEFAULT_NOMBRE_PARROQUIA);
        return parroquia;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parroquia createUpdatedEntity(EntityManager em) {
        Parroquia parroquia = new Parroquia().nombreParroquia(UPDATED_NOMBRE_PARROQUIA);
        return parroquia;
    }

    @BeforeEach
    public void initTest() {
        parroquia = createEntity(em);
    }

    @Test
    @Transactional
    void createParroquia() throws Exception {
        int databaseSizeBeforeCreate = parroquiaRepository.findAll().size();
        // Create the Parroquia
        restParroquiaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parroquia)))
            .andExpect(status().isCreated());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeCreate + 1);
        Parroquia testParroquia = parroquiaList.get(parroquiaList.size() - 1);
        assertThat(testParroquia.getNombreParroquia()).isEqualTo(DEFAULT_NOMBRE_PARROQUIA);
    }

    @Test
    @Transactional
    void createParroquiaWithExistingId() throws Exception {
        // Create the Parroquia with an existing ID
        parroquia.setId(1L);

        int databaseSizeBeforeCreate = parroquiaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restParroquiaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parroquia)))
            .andExpect(status().isBadRequest());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllParroquias() throws Exception {
        // Initialize the database
        parroquiaRepository.saveAndFlush(parroquia);

        // Get all the parroquiaList
        restParroquiaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parroquia.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombreParroquia").value(hasItem(DEFAULT_NOMBRE_PARROQUIA)));
    }

    @Test
    @Transactional
    void getParroquia() throws Exception {
        // Initialize the database
        parroquiaRepository.saveAndFlush(parroquia);

        // Get the parroquia
        restParroquiaMockMvc
            .perform(get(ENTITY_API_URL_ID, parroquia.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(parroquia.getId().intValue()))
            .andExpect(jsonPath("$.nombreParroquia").value(DEFAULT_NOMBRE_PARROQUIA));
    }

    @Test
    @Transactional
    void getNonExistingParroquia() throws Exception {
        // Get the parroquia
        restParroquiaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingParroquia() throws Exception {
        // Initialize the database
        parroquiaRepository.saveAndFlush(parroquia);

        int databaseSizeBeforeUpdate = parroquiaRepository.findAll().size();

        // Update the parroquia
        Parroquia updatedParroquia = parroquiaRepository.findById(parroquia.getId()).get();
        // Disconnect from session so that the updates on updatedParroquia are not directly saved in db
        em.detach(updatedParroquia);
        updatedParroquia.nombreParroquia(UPDATED_NOMBRE_PARROQUIA);

        restParroquiaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedParroquia.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedParroquia))
            )
            .andExpect(status().isOk());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeUpdate);
        Parroquia testParroquia = parroquiaList.get(parroquiaList.size() - 1);
        assertThat(testParroquia.getNombreParroquia()).isEqualTo(UPDATED_NOMBRE_PARROQUIA);
    }

    @Test
    @Transactional
    void putNonExistingParroquia() throws Exception {
        int databaseSizeBeforeUpdate = parroquiaRepository.findAll().size();
        parroquia.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParroquiaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, parroquia.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parroquia))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchParroquia() throws Exception {
        int databaseSizeBeforeUpdate = parroquiaRepository.findAll().size();
        parroquia.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParroquiaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parroquia))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamParroquia() throws Exception {
        int databaseSizeBeforeUpdate = parroquiaRepository.findAll().size();
        parroquia.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParroquiaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parroquia)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateParroquiaWithPatch() throws Exception {
        // Initialize the database
        parroquiaRepository.saveAndFlush(parroquia);

        int databaseSizeBeforeUpdate = parroquiaRepository.findAll().size();

        // Update the parroquia using partial update
        Parroquia partialUpdatedParroquia = new Parroquia();
        partialUpdatedParroquia.setId(parroquia.getId());

        partialUpdatedParroquia.nombreParroquia(UPDATED_NOMBRE_PARROQUIA);

        restParroquiaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParroquia.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParroquia))
            )
            .andExpect(status().isOk());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeUpdate);
        Parroquia testParroquia = parroquiaList.get(parroquiaList.size() - 1);
        assertThat(testParroquia.getNombreParroquia()).isEqualTo(UPDATED_NOMBRE_PARROQUIA);
    }

    @Test
    @Transactional
    void fullUpdateParroquiaWithPatch() throws Exception {
        // Initialize the database
        parroquiaRepository.saveAndFlush(parroquia);

        int databaseSizeBeforeUpdate = parroquiaRepository.findAll().size();

        // Update the parroquia using partial update
        Parroquia partialUpdatedParroquia = new Parroquia();
        partialUpdatedParroquia.setId(parroquia.getId());

        partialUpdatedParroquia.nombreParroquia(UPDATED_NOMBRE_PARROQUIA);

        restParroquiaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParroquia.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParroquia))
            )
            .andExpect(status().isOk());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeUpdate);
        Parroquia testParroquia = parroquiaList.get(parroquiaList.size() - 1);
        assertThat(testParroquia.getNombreParroquia()).isEqualTo(UPDATED_NOMBRE_PARROQUIA);
    }

    @Test
    @Transactional
    void patchNonExistingParroquia() throws Exception {
        int databaseSizeBeforeUpdate = parroquiaRepository.findAll().size();
        parroquia.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParroquiaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, parroquia.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parroquia))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchParroquia() throws Exception {
        int databaseSizeBeforeUpdate = parroquiaRepository.findAll().size();
        parroquia.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParroquiaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parroquia))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamParroquia() throws Exception {
        int databaseSizeBeforeUpdate = parroquiaRepository.findAll().size();
        parroquia.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParroquiaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(parroquia))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Parroquia in the database
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteParroquia() throws Exception {
        // Initialize the database
        parroquiaRepository.saveAndFlush(parroquia);

        int databaseSizeBeforeDelete = parroquiaRepository.findAll().size();

        // Delete the parroquia
        restParroquiaMockMvc
            .perform(delete(ENTITY_API_URL_ID, parroquia.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Parroquia> parroquiaList = parroquiaRepository.findAll();
        assertThat(parroquiaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
