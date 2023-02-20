package com.victorpule.germoplasma.repository;

import com.victorpule.germoplasma.domain.Planta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Planta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlantaRepository extends JpaRepository<Planta, Long> {}
