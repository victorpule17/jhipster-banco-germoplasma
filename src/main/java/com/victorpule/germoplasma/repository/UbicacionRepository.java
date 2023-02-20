package com.victorpule.germoplasma.repository;

import com.victorpule.germoplasma.domain.Ubicacion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Ubicacion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {}
