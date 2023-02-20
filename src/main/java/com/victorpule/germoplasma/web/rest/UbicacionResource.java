package com.victorpule.germoplasma.web.rest;

import com.victorpule.germoplasma.domain.Ubicacion;
import com.victorpule.germoplasma.repository.UbicacionRepository;
import com.victorpule.germoplasma.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.victorpule.germoplasma.domain.Ubicacion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UbicacionResource {

    private final Logger log = LoggerFactory.getLogger(UbicacionResource.class);

    private static final String ENTITY_NAME = "ubicacion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UbicacionRepository ubicacionRepository;

    public UbicacionResource(UbicacionRepository ubicacionRepository) {
        this.ubicacionRepository = ubicacionRepository;
    }

    /**
     * {@code POST  /ubicacions} : Create a new ubicacion.
     *
     * @param ubicacion the ubicacion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ubicacion, or with status {@code 400 (Bad Request)} if the ubicacion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ubicacions")
    public ResponseEntity<Ubicacion> createUbicacion(@RequestBody Ubicacion ubicacion) throws URISyntaxException {
        log.debug("REST request to save Ubicacion : {}", ubicacion);
        if (ubicacion.getId() != null) {
            throw new BadRequestAlertException("A new ubicacion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ubicacion result = ubicacionRepository.save(ubicacion);
        return ResponseEntity
            .created(new URI("/api/ubicacions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ubicacions/:id} : Updates an existing ubicacion.
     *
     * @param id the id of the ubicacion to save.
     * @param ubicacion the ubicacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ubicacion,
     * or with status {@code 400 (Bad Request)} if the ubicacion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ubicacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ubicacions/{id}")
    public ResponseEntity<Ubicacion> updateUbicacion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ubicacion ubicacion
    ) throws URISyntaxException {
        log.debug("REST request to update Ubicacion : {}, {}", id, ubicacion);
        if (ubicacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ubicacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ubicacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ubicacion result = ubicacionRepository.save(ubicacion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ubicacion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ubicacions/:id} : Partial updates given fields of an existing ubicacion, field will ignore if it is null
     *
     * @param id the id of the ubicacion to save.
     * @param ubicacion the ubicacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ubicacion,
     * or with status {@code 400 (Bad Request)} if the ubicacion is not valid,
     * or with status {@code 404 (Not Found)} if the ubicacion is not found,
     * or with status {@code 500 (Internal Server Error)} if the ubicacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ubicacions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ubicacion> partialUpdateUbicacion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ubicacion ubicacion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ubicacion partially : {}, {}", id, ubicacion);
        if (ubicacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ubicacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ubicacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ubicacion> result = ubicacionRepository
            .findById(ubicacion.getId())
            .map(existingUbicacion -> {
                if (ubicacion.getCallePrincipal() != null) {
                    existingUbicacion.setCallePrincipal(ubicacion.getCallePrincipal());
                }
                if (ubicacion.getCalleSecundaria() != null) {
                    existingUbicacion.setCalleSecundaria(ubicacion.getCalleSecundaria());
                }
                if (ubicacion.getLatitud() != null) {
                    existingUbicacion.setLatitud(ubicacion.getLatitud());
                }
                if (ubicacion.getAltitud() != null) {
                    existingUbicacion.setAltitud(ubicacion.getAltitud());
                }
                if (ubicacion.getLongitud() != null) {
                    existingUbicacion.setLongitud(ubicacion.getLongitud());
                }

                return existingUbicacion;
            })
            .map(ubicacionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ubicacion.getId().toString())
        );
    }

    /**
     * {@code GET  /ubicacions} : get all the ubicacions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ubicacions in body.
     */
    @GetMapping("/ubicacions")
    public ResponseEntity<List<Ubicacion>> getAllUbicacions(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Ubicacions");
        Page<Ubicacion> page = ubicacionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /ubicacions/:id} : get the "id" ubicacion.
     *
     * @param id the id of the ubicacion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ubicacion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ubicacions/{id}")
    public ResponseEntity<Ubicacion> getUbicacion(@PathVariable Long id) {
        log.debug("REST request to get Ubicacion : {}", id);
        Optional<Ubicacion> ubicacion = ubicacionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ubicacion);
    }

    /**
     * {@code DELETE  /ubicacions/:id} : delete the "id" ubicacion.
     *
     * @param id the id of the ubicacion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ubicacions/{id}")
    public ResponseEntity<Void> deleteUbicacion(@PathVariable Long id) {
        log.debug("REST request to delete Ubicacion : {}", id);
        ubicacionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
