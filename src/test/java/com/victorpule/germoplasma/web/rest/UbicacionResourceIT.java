package com.victorpule.germoplasma.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.victorpule.germoplasma.IntegrationTest;
import com.victorpule.germoplasma.domain.Ubicacion;
import com.victorpule.germoplasma.repository.UbicacionRepository;
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
 * Integration tests for the {@link UbicacionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UbicacionResourceIT {

    private static final String DEFAULT_CALLE_PRINCIPAL = "AAAAAAAAAA";
    private static final String UPDATED_CALLE_PRINCIPAL = "BBBBBBBBBB";

    private static final String DEFAULT_CALLE_SECUNDARIA = "AAAAAAAAAA";
    private static final String UPDATED_CALLE_SECUNDARIA = "BBBBBBBBBB";

    private static final String DEFAULT_LATITUD = "AAAAAAAAAA";
    private static final String UPDATED_LATITUD = "BBBBBBBBBB";

    private static final String DEFAULT_ALTITUD = "AAAAAAAAAA";
    private static final String UPDATED_ALTITUD = "BBBBBBBBBB";

    private static final String DEFAULT_LONGITUD = "AAAAAAAAAA";
    private static final String UPDATED_LONGITUD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ubicacions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UbicacionRepository ubicacionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUbicacionMockMvc;

    private Ubicacion ubicacion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ubicacion createEntity(EntityManager em) {
        Ubicacion ubicacion = new Ubicacion()
            .callePrincipal(DEFAULT_CALLE_PRINCIPAL)
            .calleSecundaria(DEFAULT_CALLE_SECUNDARIA)
            .latitud(DEFAULT_LATITUD)
            .altitud(DEFAULT_ALTITUD)
            .longitud(DEFAULT_LONGITUD);
        return ubicacion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ubicacion createUpdatedEntity(EntityManager em) {
        Ubicacion ubicacion = new Ubicacion()
            .callePrincipal(UPDATED_CALLE_PRINCIPAL)
            .calleSecundaria(UPDATED_CALLE_SECUNDARIA)
            .latitud(UPDATED_LATITUD)
            .altitud(UPDATED_ALTITUD)
            .longitud(UPDATED_LONGITUD);
        return ubicacion;
    }

    @BeforeEach
    public void initTest() {
        ubicacion = createEntity(em);
    }

    @Test
    @Transactional
    void createUbicacion() throws Exception {
        int databaseSizeBeforeCreate = ubicacionRepository.findAll().size();
        // Create the Ubicacion
        restUbicacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ubicacion)))
            .andExpect(status().isCreated());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeCreate + 1);
        Ubicacion testUbicacion = ubicacionList.get(ubicacionList.size() - 1);
        assertThat(testUbicacion.getCallePrincipal()).isEqualTo(DEFAULT_CALLE_PRINCIPAL);
        assertThat(testUbicacion.getCalleSecundaria()).isEqualTo(DEFAULT_CALLE_SECUNDARIA);
        assertThat(testUbicacion.getLatitud()).isEqualTo(DEFAULT_LATITUD);
        assertThat(testUbicacion.getAltitud()).isEqualTo(DEFAULT_ALTITUD);
        assertThat(testUbicacion.getLongitud()).isEqualTo(DEFAULT_LONGITUD);
    }

    @Test
    @Transactional
    void createUbicacionWithExistingId() throws Exception {
        // Create the Ubicacion with an existing ID
        ubicacion.setId(1L);

        int databaseSizeBeforeCreate = ubicacionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUbicacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ubicacion)))
            .andExpect(status().isBadRequest());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUbicacions() throws Exception {
        // Initialize the database
        ubicacionRepository.saveAndFlush(ubicacion);

        // Get all the ubicacionList
        restUbicacionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ubicacion.getId().intValue())))
            .andExpect(jsonPath("$.[*].callePrincipal").value(hasItem(DEFAULT_CALLE_PRINCIPAL)))
            .andExpect(jsonPath("$.[*].calleSecundaria").value(hasItem(DEFAULT_CALLE_SECUNDARIA)))
            .andExpect(jsonPath("$.[*].latitud").value(hasItem(DEFAULT_LATITUD)))
            .andExpect(jsonPath("$.[*].altitud").value(hasItem(DEFAULT_ALTITUD)))
            .andExpect(jsonPath("$.[*].longitud").value(hasItem(DEFAULT_LONGITUD)));
    }

    @Test
    @Transactional
    void getUbicacion() throws Exception {
        // Initialize the database
        ubicacionRepository.saveAndFlush(ubicacion);

        // Get the ubicacion
        restUbicacionMockMvc
            .perform(get(ENTITY_API_URL_ID, ubicacion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ubicacion.getId().intValue()))
            .andExpect(jsonPath("$.callePrincipal").value(DEFAULT_CALLE_PRINCIPAL))
            .andExpect(jsonPath("$.calleSecundaria").value(DEFAULT_CALLE_SECUNDARIA))
            .andExpect(jsonPath("$.latitud").value(DEFAULT_LATITUD))
            .andExpect(jsonPath("$.altitud").value(DEFAULT_ALTITUD))
            .andExpect(jsonPath("$.longitud").value(DEFAULT_LONGITUD));
    }

    @Test
    @Transactional
    void getNonExistingUbicacion() throws Exception {
        // Get the ubicacion
        restUbicacionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUbicacion() throws Exception {
        // Initialize the database
        ubicacionRepository.saveAndFlush(ubicacion);

        int databaseSizeBeforeUpdate = ubicacionRepository.findAll().size();

        // Update the ubicacion
        Ubicacion updatedUbicacion = ubicacionRepository.findById(ubicacion.getId()).get();
        // Disconnect from session so that the updates on updatedUbicacion are not directly saved in db
        em.detach(updatedUbicacion);
        updatedUbicacion
            .callePrincipal(UPDATED_CALLE_PRINCIPAL)
            .calleSecundaria(UPDATED_CALLE_SECUNDARIA)
            .latitud(UPDATED_LATITUD)
            .altitud(UPDATED_ALTITUD)
            .longitud(UPDATED_LONGITUD);

        restUbicacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUbicacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUbicacion))
            )
            .andExpect(status().isOk());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeUpdate);
        Ubicacion testUbicacion = ubicacionList.get(ubicacionList.size() - 1);
        assertThat(testUbicacion.getCallePrincipal()).isEqualTo(UPDATED_CALLE_PRINCIPAL);
        assertThat(testUbicacion.getCalleSecundaria()).isEqualTo(UPDATED_CALLE_SECUNDARIA);
        assertThat(testUbicacion.getLatitud()).isEqualTo(UPDATED_LATITUD);
        assertThat(testUbicacion.getAltitud()).isEqualTo(UPDATED_ALTITUD);
        assertThat(testUbicacion.getLongitud()).isEqualTo(UPDATED_LONGITUD);
    }

    @Test
    @Transactional
    void putNonExistingUbicacion() throws Exception {
        int databaseSizeBeforeUpdate = ubicacionRepository.findAll().size();
        ubicacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUbicacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ubicacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ubicacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUbicacion() throws Exception {
        int databaseSizeBeforeUpdate = ubicacionRepository.findAll().size();
        ubicacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUbicacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ubicacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUbicacion() throws Exception {
        int databaseSizeBeforeUpdate = ubicacionRepository.findAll().size();
        ubicacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUbicacionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ubicacion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUbicacionWithPatch() throws Exception {
        // Initialize the database
        ubicacionRepository.saveAndFlush(ubicacion);

        int databaseSizeBeforeUpdate = ubicacionRepository.findAll().size();

        // Update the ubicacion using partial update
        Ubicacion partialUpdatedUbicacion = new Ubicacion();
        partialUpdatedUbicacion.setId(ubicacion.getId());

        partialUpdatedUbicacion.calleSecundaria(UPDATED_CALLE_SECUNDARIA).latitud(UPDATED_LATITUD).altitud(UPDATED_ALTITUD);

        restUbicacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUbicacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUbicacion))
            )
            .andExpect(status().isOk());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeUpdate);
        Ubicacion testUbicacion = ubicacionList.get(ubicacionList.size() - 1);
        assertThat(testUbicacion.getCallePrincipal()).isEqualTo(DEFAULT_CALLE_PRINCIPAL);
        assertThat(testUbicacion.getCalleSecundaria()).isEqualTo(UPDATED_CALLE_SECUNDARIA);
        assertThat(testUbicacion.getLatitud()).isEqualTo(UPDATED_LATITUD);
        assertThat(testUbicacion.getAltitud()).isEqualTo(UPDATED_ALTITUD);
        assertThat(testUbicacion.getLongitud()).isEqualTo(DEFAULT_LONGITUD);
    }

    @Test
    @Transactional
    void fullUpdateUbicacionWithPatch() throws Exception {
        // Initialize the database
        ubicacionRepository.saveAndFlush(ubicacion);

        int databaseSizeBeforeUpdate = ubicacionRepository.findAll().size();

        // Update the ubicacion using partial update
        Ubicacion partialUpdatedUbicacion = new Ubicacion();
        partialUpdatedUbicacion.setId(ubicacion.getId());

        partialUpdatedUbicacion
            .callePrincipal(UPDATED_CALLE_PRINCIPAL)
            .calleSecundaria(UPDATED_CALLE_SECUNDARIA)
            .latitud(UPDATED_LATITUD)
            .altitud(UPDATED_ALTITUD)
            .longitud(UPDATED_LONGITUD);

        restUbicacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUbicacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUbicacion))
            )
            .andExpect(status().isOk());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeUpdate);
        Ubicacion testUbicacion = ubicacionList.get(ubicacionList.size() - 1);
        assertThat(testUbicacion.getCallePrincipal()).isEqualTo(UPDATED_CALLE_PRINCIPAL);
        assertThat(testUbicacion.getCalleSecundaria()).isEqualTo(UPDATED_CALLE_SECUNDARIA);
        assertThat(testUbicacion.getLatitud()).isEqualTo(UPDATED_LATITUD);
        assertThat(testUbicacion.getAltitud()).isEqualTo(UPDATED_ALTITUD);
        assertThat(testUbicacion.getLongitud()).isEqualTo(UPDATED_LONGITUD);
    }

    @Test
    @Transactional
    void patchNonExistingUbicacion() throws Exception {
        int databaseSizeBeforeUpdate = ubicacionRepository.findAll().size();
        ubicacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUbicacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ubicacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ubicacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUbicacion() throws Exception {
        int databaseSizeBeforeUpdate = ubicacionRepository.findAll().size();
        ubicacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUbicacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ubicacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUbicacion() throws Exception {
        int databaseSizeBeforeUpdate = ubicacionRepository.findAll().size();
        ubicacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUbicacionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ubicacion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ubicacion in the database
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUbicacion() throws Exception {
        // Initialize the database
        ubicacionRepository.saveAndFlush(ubicacion);

        int databaseSizeBeforeDelete = ubicacionRepository.findAll().size();

        // Delete the ubicacion
        restUbicacionMockMvc
            .perform(delete(ENTITY_API_URL_ID, ubicacion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ubicacion> ubicacionList = ubicacionRepository.findAll();
        assertThat(ubicacionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
