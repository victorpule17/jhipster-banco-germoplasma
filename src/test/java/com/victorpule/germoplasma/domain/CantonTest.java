package com.victorpule.germoplasma.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.victorpule.germoplasma.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CantonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Canton.class);
        Canton canton1 = new Canton();
        canton1.setId(1L);
        Canton canton2 = new Canton();
        canton2.setId(canton1.getId());
        assertThat(canton1).isEqualTo(canton2);
        canton2.setId(2L);
        assertThat(canton1).isNotEqualTo(canton2);
        canton1.setId(null);
        assertThat(canton1).isNotEqualTo(canton2);
    }
}