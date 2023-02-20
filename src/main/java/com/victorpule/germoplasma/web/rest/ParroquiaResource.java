package com.victorpule.germoplasma.web.rest;

import com.victorpule.germoplasma.domain.Parroquia;
import com.victorpule.germoplasma.repository.ParroquiaRepository;
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
 * REST controller for managing {@link com.victorpule.germoplasma.domain.Parroquia}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParroquiaResource {

    private final Logger log = LoggerFactory.getLogger(ParroquiaResource.class);

    private static final String ENTITY_NAME = "parroquia";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParroquiaRepository parroquiaRepository;

    public ParroquiaResource(ParroquiaRepository parroquiaRepository) {
        this.parroquiaRepository = parroquiaRepository;
    }

    /**
     * {@code POST  /parroquias} : Create a new parroquia.
     *
     * @param parroquia the parroquia to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parroquia, or with status {@code 400 (Bad Request)} if the parroquia has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parroquias")
    public ResponseEntity<Parroquia> createParroquia(@RequestBody Parroquia parroquia) throws URISyntaxException {
        log.debug("REST request to save Parroquia : {}", parroquia);
        if (parroquia.getId() != null) {
            throw new BadRequestAlertException("A new parroquia cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Parroquia result = parroquiaRepository.save(parroquia);
        return ResponseEntity
            .created(new URI("/api/parroquias/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /parroquias/:id} : Updates an existing parroquia.
     *
     * @param id the id of the parroquia to save.
     * @param parroquia the parroquia to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parroquia,
     * or with status {@code 400 (Bad Request)} if the parroquia is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parroquia couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parroquias/{id}")
    public ResponseEntity<Parroquia> updateParroquia(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Parroquia parroquia
    ) throws URISyntaxException {
        log.debug("REST request to update Parroquia : {}, {}", id, parroquia);
        if (parroquia.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parroquia.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parroquiaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Parroquia result = parroquiaRepository.save(parroquia);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, parroquia.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /parroquias/:id} : Partial updates given fields of an existing parroquia, field will ignore if it is null
     *
     * @param id the id of the parroquia to save.
     * @param parroquia the parroquia to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parroquia,
     * or with status {@code 400 (Bad Request)} if the parroquia is not valid,
     * or with status {@code 404 (Not Found)} if the parroquia is not found,
     * or with status {@code 500 (Internal Server Error)} if the parroquia couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parroquias/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Parroquia> partialUpdateParroquia(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Parroquia parroquia
    ) throws URISyntaxException {
        log.debug("REST request to partial update Parroquia partially : {}, {}", id, parroquia);
        if (parroquia.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parroquia.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parroquiaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Parroquia> result = parroquiaRepository
            .findById(parroquia.getId())
            .map(existingParroquia -> {
                if (parroquia.getNombreParroquia() != null) {
                    existingParroquia.setNombreParroquia(parroquia.getNombreParroquia());
                }

                return existingParroquia;
            })
            .map(parroquiaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, parroquia.getId().toString())
        );
    }

    /**
     * {@code GET  /parroquias} : get all the parroquias.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parroquias in body.
     */
    @GetMapping("/parroquias")
    public ResponseEntity<List<Parroquia>> getAllParroquias(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Parroquias");
        Page<Parroquia> page = parroquiaRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /parroquias/:id} : get the "id" parroquia.
     *
     * @param id the id of the parroquia to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parroquia, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parroquias/{id}")
    public ResponseEntity<Parroquia> getParroquia(@PathVariable Long id) {
        log.debug("REST request to get Parroquia : {}", id);
        Optional<Parroquia> parroquia = parroquiaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parroquia);
    }

    /**
     * {@code DELETE  /parroquias/:id} : delete the "id" parroquia.
     *
     * @param id the id of the parroquia to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parroquias/{id}")
    public ResponseEntity<Void> deleteParroquia(@PathVariable Long id) {
        log.debug("REST request to delete Parroquia : {}", id);
        parroquiaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
