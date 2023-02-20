package com.victorpule.germoplasma.repository;

import com.victorpule.germoplasma.domain.Parroquia;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Parroquia entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParroquiaRepository extends JpaRepository<Parroquia, Long> {}
