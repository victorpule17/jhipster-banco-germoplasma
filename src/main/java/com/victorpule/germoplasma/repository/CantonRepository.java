package com.victorpule.germoplasma.repository;

import com.victorpule.germoplasma.domain.Canton;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Canton entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CantonRepository extends JpaRepository<Canton, Long> {}
