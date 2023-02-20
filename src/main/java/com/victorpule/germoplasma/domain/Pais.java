package com.victorpule.germoplasma.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A Pais.
 */
@Entity
@Table(name = "pais")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pais implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre_pais")
    private String nombrePais;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pais id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombrePais() {
        return this.nombrePais;
    }

    public Pais nombrePais(String nombrePais) {
        this.setNombrePais(nombrePais);
        return this;
    }

    public void setNombrePais(String nombrePais) {
        this.nombrePais = nombrePais;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pais)) {
            return false;
        }
        return id != null && id.equals(((Pais) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pais{" +
            "id=" + getId() +
            ", nombrePais='" + getNombrePais() + "'" +
            "}";
    }
}
