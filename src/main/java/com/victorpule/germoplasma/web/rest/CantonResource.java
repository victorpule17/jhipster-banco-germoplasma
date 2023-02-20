package com.victorpule.germoplasma.web.rest;

import com.victorpule.germoplasma.domain.Canton;
import com.victorpule.germoplasma.repository.CantonRepository;
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
 * REST controller for managing {@link com.victorpule.germoplasma.domain.Canton}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CantonResource {

    private final Logger log = LoggerFactory.getLogger(CantonResource.class);

    private static final String ENTITY_NAME = "canton";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CantonRepository cantonRepository;

    public CantonResource(CantonRepository cantonRepository) {
        this.cantonRepository = cantonRepository;
    }

    /**
     * {@code POST  /cantons} : Create a new canton.
     *
     * @param canton the canton to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new canton, or with status {@code 400 (Bad Request)} if the canton has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cantons")
    public ResponseEntity<Canton> createCanton(@RequestBody Canton canton) throws URISyntaxException {
        log.debug("REST request to save Canton : {}", canton);
        if (canton.getId() != null) {
            throw new BadRequestAlertException("A new canton cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Canton result = cantonRepository.save(canton);
        return ResponseEntity
            .created(new URI("/api/cantons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cantons/:id} : Updates an existing canton.
     *
     * @param id the id of the canton to save.
     * @param canton the canton to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated canton,
     * or with status {@code 400 (Bad Request)} if the canton is not valid,
     * or with status {@code 500 (Internal Server Error)} if the canton couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cantons/{id}")
    public ResponseEntity<Canton> updateCanton(@PathVariable(value = "id", required = false) final Long id, @RequestBody Canton canton)
        throws URISyntaxException {
        log.debug("REST request to update Canton : {}, {}", id, canton);
        if (canton.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, canton.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cantonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Canton result = cantonRepository.save(canton);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, canton.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cantons/:id} : Partial updates given fields of an existing canton, field will ignore if it is null
     *
     * @param id the id of the canton to save.
     * @param canton the canton to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated canton,
     * or with status {@code 400 (Bad Request)} if the canton is not valid,
     * or with status {@code 404 (Not Found)} if the canton is not found,
     * or with status {@code 500 (Internal Server Error)} if the canton couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cantons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Canton> partialUpdateCanton(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Canton canton
    ) throws URISyntaxException {
        log.debug("REST request to partial update Canton partially : {}, {}", id, canton);
        if (canton.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, canton.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cantonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Canton> result = cantonRepository
            .findById(canton.getId())
            .map(existingCanton -> {
                if (canton.getNombreCanton() != null) {
                    existingCanton.setNombreCanton(canton.getNombreCanton());
                }

                return existingCanton;
            })
            .map(cantonRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, canton.getId().toString())
        );
    }

    /**
     * {@code GET  /cantons} : get all the cantons.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cantons in body.
     */
    @GetMapping("/cantons")
    public ResponseEntity<List<Canton>> getAllCantons(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Cantons");
        Page<Canton> page = cantonRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /cantons/:id} : get the "id" canton.
     *
     * @param id the id of the canton to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the canton, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cantons/{id}")
    public ResponseEntity<Canton> getCanton(@PathVariable Long id) {
        log.debug("REST request to get Canton : {}", id);
        Optional<Canton> canton = cantonRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(canton);
    }

    /**
     * {@code DELETE  /cantons/:id} : delete the "id" canton.
     *
     * @param id the id of the canton to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cantons/{id}")
    public ResponseEntity<Void> deleteCanton(@PathVariable Long id) {
        log.debug("REST request to delete Canton : {}", id);
        cantonRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
