package com.victorpule.germoplasma.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.victorpule.germoplasma.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParroquiaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Parroquia.class);
        Parroquia parroquia1 = new Parroquia();
        parroquia1.setId(1L);
        Parroquia parroquia2 = new Parroquia();
        parroquia2.setId(parroquia1.getId());
        assertThat(parroquia1).isEqualTo(parroquia2);
        parroquia2.setId(2L);
        assertThat(parroquia1).isNotEqualTo(parroquia2);
        parroquia1.setId(null);
        assertThat(parroquia1).isNotEqualTo(parroquia2);
    }
}
