package com.victorpule.germoplasma.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.victorpule.germoplasma.IntegrationTest;
import com.victorpule.germoplasma.domain.Canton;
import com.victorpule.germoplasma.repository.CantonRepository;
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
 * Integration tests for the {@link CantonResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CantonResourceIT {

    private static final String DEFAULT_NOMBRE_CANTON = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_CANTON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/cantons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CantonRepository cantonRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCantonMockMvc;

    private Canton canton;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Canton createEntity(EntityManager em) {
        Canton canton = new Canton().nombreCanton(DEFAULT_NOMBRE_CANTON);
        return canton;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Canton createUpdatedEntity(EntityManager em) {
        Canton canton = new Canton().nombreCanton(UPDATED_NOMBRE_CANTON);
        return canton;
    }

    @BeforeEach
    public void initTest() {
        canton = createEntity(em);
    }

    @Test
    @Transactional
    void createCanton() throws Exception {
        int databaseSizeBeforeCreate = cantonRepository.findAll().size();
        // Create the Canton
        restCantonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(canton)))
            .andExpect(status().isCreated());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeCreate + 1);
        Canton testCanton = cantonList.get(cantonList.size() - 1);
        assertThat(testCanton.getNombreCanton()).isEqualTo(DEFAULT_NOMBRE_CANTON);
    }

    @Test
    @Transactional
    void createCantonWithExistingId() throws Exception {
        // Create the Canton with an existing ID
        canton.setId(1L);

        int databaseSizeBeforeCreate = cantonRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCantonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(canton)))
            .andExpect(status().isBadRequest());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCantons() throws Exception {
        // Initialize the database
        cantonRepository.saveAndFlush(canton);

        // Get all the cantonList
        restCantonMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(canton.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombreCanton").value(hasItem(DEFAULT_NOMBRE_CANTON)));
    }

    @Test
    @Transactional
    void getCanton() throws Exception {
        // Initialize the database
        cantonRepository.saveAndFlush(canton);

        // Get the canton
        restCantonMockMvc
            .perform(get(ENTITY_API_URL_ID, canton.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(canton.getId().intValue()))
            .andExpect(jsonPath("$.nombreCanton").value(DEFAULT_NOMBRE_CANTON));
    }

    @Test
    @Transactional
    void getNonExistingCanton() throws Exception {
        // Get the canton
        restCantonMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCanton() throws Exception {
        // Initialize the database
        cantonRepository.saveAndFlush(canton);

        int databaseSizeBeforeUpdate = cantonRepository.findAll().size();

        // Update the canton
        Canton updatedCanton = cantonRepository.findById(canton.getId()).get();
        // Disconnect from session so that the updates on updatedCanton are not directly saved in db
        em.detach(updatedCanton);
        updatedCanton.nombreCanton(UPDATED_NOMBRE_CANTON);

        restCantonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCanton.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCanton))
            )
            .andExpect(status().isOk());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeUpdate);
        Canton testCanton = cantonList.get(cantonList.size() - 1);
        assertThat(testCanton.getNombreCanton()).isEqualTo(UPDATED_NOMBRE_CANTON);
    }

    @Test
    @Transactional
    void putNonExistingCanton() throws Exception {
        int databaseSizeBeforeUpdate = cantonRepository.findAll().size();
        canton.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCantonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, canton.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(canton))
            )
            .andExpect(status().isBadRequest());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCanton() throws Exception {
        int databaseSizeBeforeUpdate = cantonRepository.findAll().size();
        canton.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCantonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(canton))
            )
            .andExpect(status().isBadRequest());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCanton() throws Exception {
        int databaseSizeBeforeUpdate = cantonRepository.findAll().size();
        canton.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCantonMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(canton)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCantonWithPatch() throws Exception {
        // Initialize the database
        cantonRepository.saveAndFlush(canton);

        int databaseSizeBeforeUpdate = cantonRepository.findAll().size();

        // Update the canton using partial update
        Canton partialUpdatedCanton = new Canton();
        partialUpdatedCanton.setId(canton.getId());

        restCantonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCanton.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCanton))
            )
            .andExpect(status().isOk());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeUpdate);
        Canton testCanton = cantonList.get(cantonList.size() - 1);
        assertThat(testCanton.getNombreCanton()).isEqualTo(DEFAULT_NOMBRE_CANTON);
    }

    @Test
    @Transactional
    void fullUpdateCantonWithPatch() throws Exception {
        // Initialize the database
        cantonRepository.saveAndFlush(canton);

        int databaseSizeBeforeUpdate = cantonRepository.findAll().size();

        // Update the canton using partial update
        Canton partialUpdatedCanton = new Canton();
        partialUpdatedCanton.setId(canton.getId());

        partialUpdatedCanton.nombreCanton(UPDATED_NOMBRE_CANTON);

        restCantonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCanton.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCanton))
            )
            .andExpect(status().isOk());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeUpdate);
        Canton testCanton = cantonList.get(cantonList.size() - 1);
        assertThat(testCanton.getNombreCanton()).isEqualTo(UPDATED_NOMBRE_CANTON);
    }

    @Test
    @Transactional
    void patchNonExistingCanton() throws Exception {
        int databaseSizeBeforeUpdate = cantonRepository.findAll().size();
        canton.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCantonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, canton.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(canton))
            )
            .andExpect(status().isBadRequest());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCanton() throws Exception {
        int databaseSizeBeforeUpdate = cantonRepository.findAll().size();
        canton.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCantonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(canton))
            )
            .andExpect(status().isBadRequest());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCanton() throws Exception {
        int databaseSizeBeforeUpdate = cantonRepository.findAll().size();
        canton.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCantonMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(canton)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Canton in the database
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCanton() throws Exception {
        // Initialize the database
        cantonRepository.saveAndFlush(canton);

        int databaseSizeBeforeDelete = cantonRepository.findAll().size();

        // Delete the canton
        restCantonMockMvc
            .perform(delete(ENTITY_API_URL_ID, canton.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Canton> cantonList = cantonRepository.findAll();
        assertThat(cantonList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
