package com.victorpule.germoplasma.web.rest;

import com.victorpule.germoplasma.domain.Pais;
import com.victorpule.germoplasma.repository.PaisRepository;
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
 * REST controller for managing {@link com.victorpule.germoplasma.domain.Pais}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PaisResource {

    private final Logger log = LoggerFactory.getLogger(PaisResource.class);

    private static final String ENTITY_NAME = "pais";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PaisRepository paisRepository;

    public PaisResource(PaisRepository paisRepository) {
        this.paisRepository = paisRepository;
    }

    /**
     * {@code POST  /pais} : Create a new pais.
     *
     * @param pais the pais to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pais, or with status {@code 400 (Bad Request)} if the pais has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pais")
    public ResponseEntity<Pais> createPais(@RequestBody Pais pais) throws URISyntaxException {
        log.debug("REST request to save Pais : {}", pais);
        if (pais.getId() != null) {
            throw new BadRequestAlertException("A new pais cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pais result = paisRepository.save(pais);
        return ResponseEntity
            .created(new URI("/api/pais/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pais/:id} : Updates an existing pais.
     *
     * @param id the id of the pais to save.
     * @param pais the pais to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pais,
     * or with status {@code 400 (Bad Request)} if the pais is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pais couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pais/{id}")
    public ResponseEntity<Pais> updatePais(@PathVariable(value = "id", required = false) final Long id, @RequestBody Pais pais)
        throws URISyntaxException {
        log.debug("REST request to update Pais : {}, {}", id, pais);
        if (pais.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pais.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!paisRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Pais result = paisRepository.save(pais);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pais.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pais/:id} : Partial updates given fields of an existing pais, field will ignore if it is null
     *
     * @param id the id of the pais to save.
     * @param pais the pais to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pais,
     * or with status {@code 400 (Bad Request)} if the pais is not valid,
     * or with status {@code 404 (Not Found)} if the pais is not found,
     * or with status {@code 500 (Internal Server Error)} if the pais couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pais/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Pais> partialUpdatePais(@PathVariable(value = "id", required = false) final Long id, @RequestBody Pais pais)
        throws URISyntaxException {
        log.debug("REST request to partial update Pais partially : {}, {}", id, pais);
        if (pais.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pais.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!paisRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Pais> result = paisRepository
            .findById(pais.getId())
            .map(existingPais -> {
                if (pais.getNombrePais() != null) {
                    existingPais.setNombrePais(pais.getNombrePais());
                }

                return existingPais;
            })
            .map(paisRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pais.getId().toString())
        );
    }

    /**
     * {@code GET  /pais} : get all the pais.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pais in body.
     */
    @GetMapping("/pais")
    public ResponseEntity<List<Pais>> getAllPais(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Pais");
        Page<Pais> page = paisRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /pais/:id} : get the "id" pais.
     *
     * @param id the id of the pais to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pais, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pais/{id}")
    public ResponseEntity<Pais> getPais(@PathVariable Long id) {
        log.debug("REST request to get Pais : {}", id);
        Optional<Pais> pais = paisRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pais);
    }

    /**
     * {@code DELETE  /pais/:id} : delete the "id" pais.
     *
     * @param id the id of the pais to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pais/{id}")
    public ResponseEntity<Void> deletePais(@PathVariable Long id) {
        log.debug("REST request to delete Pais : {}", id);
        paisRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
