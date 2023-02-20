package com.victorpule.germoplasma.web.rest;

import com.victorpule.germoplasma.domain.Planta;
import com.victorpule.germoplasma.repository.PlantaRepository;
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
 * REST controller for managing {@link com.victorpule.germoplasma.domain.Planta}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PlantaResource {

    private final Logger log = LoggerFactory.getLogger(PlantaResource.class);

    private static final String ENTITY_NAME = "planta";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlantaRepository plantaRepository;

    public PlantaResource(PlantaRepository plantaRepository) {
        this.plantaRepository = plantaRepository;
    }

    /**
     * {@code POST  /plantas} : Create a new planta.
     *
     * @param planta the planta to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new planta, or with status {@code 400 (Bad Request)} if the planta has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/plantas")
    public ResponseEntity<Planta> createPlanta(@RequestBody Planta planta) throws URISyntaxException {
        log.debug("REST request to save Planta : {}", planta);
        if (planta.getId() != null) {
            throw new BadRequestAlertException("A new planta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Planta result = plantaRepository.save(planta);
        return ResponseEntity
            .created(new URI("/api/plantas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /plantas/:id} : Updates an existing planta.
     *
     * @param id the id of the planta to save.
     * @param planta the planta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated planta,
     * or with status {@code 400 (Bad Request)} if the planta is not valid,
     * or with status {@code 500 (Internal Server Error)} if the planta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/plantas/{id}")
    public ResponseEntity<Planta> updatePlanta(@PathVariable(value = "id", required = false) final Long id, @RequestBody Planta planta)
        throws URISyntaxException {
        log.debug("REST request to update Planta : {}, {}", id, planta);
        if (planta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, planta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plantaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Planta result = plantaRepository.save(planta);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, planta.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /plantas/:id} : Partial updates given fields of an existing planta, field will ignore if it is null
     *
     * @param id the id of the planta to save.
     * @param planta the planta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated planta,
     * or with status {@code 400 (Bad Request)} if the planta is not valid,
     * or with status {@code 404 (Not Found)} if the planta is not found,
     * or with status {@code 500 (Internal Server Error)} if the planta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/plantas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Planta> partialUpdatePlanta(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Planta planta
    ) throws URISyntaxException {
        log.debug("REST request to partial update Planta partially : {}, {}", id, planta);
        if (planta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, planta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plantaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Planta> result = plantaRepository
            .findById(planta.getId())
            .map(existingPlanta -> {
                if (planta.getNombre() != null) {
                    existingPlanta.setNombre(planta.getNombre());
                }
                if (planta.getEstado() != null) {
                    existingPlanta.setEstado(planta.getEstado());
                }
                if (planta.getUso() != null) {
                    existingPlanta.setUso(planta.getUso());
                }

                return existingPlanta;
            })
            .map(plantaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, planta.getId().toString())
        );
    }

    /**
     * {@code GET  /plantas} : get all the plantas.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of plantas in body.
     */
    @GetMapping("/plantas")
    public ResponseEntity<List<Planta>> getAllPlantas(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Plantas");
        Page<Planta> page = plantaRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /plantas/:id} : get the "id" planta.
     *
     * @param id the id of the planta to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the planta, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/plantas/{id}")
    public ResponseEntity<Planta> getPlanta(@PathVariable Long id) {
        log.debug("REST request to get Planta : {}", id);
        Optional<Planta> planta = plantaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(planta);
    }

    /**
     * {@code DELETE  /plantas/:id} : delete the "id" planta.
     *
     * @param id the id of the planta to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/plantas/{id}")
    public ResponseEntity<Void> deletePlanta(@PathVariable Long id) {
        log.debug("REST request to delete Planta : {}", id);
        plantaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
