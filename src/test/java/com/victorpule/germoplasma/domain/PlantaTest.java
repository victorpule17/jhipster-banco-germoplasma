package com.victorpule.germoplasma.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.victorpule.germoplasma.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlantaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Planta.class);
        Planta planta1 = new Planta();
        planta1.setId(1L);
        Planta planta2 = new Planta();
        planta2.setId(planta1.getId());
        assertThat(planta1).isEqualTo(planta2);
        planta2.setId(2L);
        assertThat(planta1).isNotEqualTo(planta2);
        planta1.setId(null);
        assertThat(planta1).isNotEqualTo(planta2);
    }
}
