package com.victorpule.germoplasma.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A Provincia.
 */
@Entity
@Table(name = "provincia")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Provincia implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre_provincia")
    private String nombreProvincia;

    @ManyToOne
    private Pais pais;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Provincia id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreProvincia() {
        return this.nombreProvincia;
    }

    public Provincia nombreProvincia(String nombreProvincia) {
        this.setNombreProvincia(nombreProvincia);
        return this;
    }

    public void setNombreProvincia(String nombreProvincia) {
        this.nombreProvincia = nombreProvincia;
    }

    public Pais getPais() {
        return this.pais;
    }

    public void setPais(Pais pais) {
        this.pais = pais;
    }

    public Provincia pais(Pais pais) {
        this.setPais(pais);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Provincia)) {
            return false;
        }
        return id != null && id.equals(((Provincia) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Provincia{" +
            "id=" + getId() +
            ", nombreProvincia='" + getNombreProvincia() + "'" +
            "}";
    }
}
