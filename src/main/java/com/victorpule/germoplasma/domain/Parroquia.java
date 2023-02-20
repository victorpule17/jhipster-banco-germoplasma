package com.victorpule.germoplasma.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Parroquia.
 */
@Entity
@Table(name = "parroquia")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Parroquia implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre_parroquia")
    private String nombreParroquia;

    @ManyToOne
    @JsonIgnoreProperties(value = { "provincia" }, allowSetters = true)
    private Canton canton;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Parroquia id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreParroquia() {
        return this.nombreParroquia;
    }

    public Parroquia nombreParroquia(String nombreParroquia) {
        this.setNombreParroquia(nombreParroquia);
        return this;
    }

    public void setNombreParroquia(String nombreParroquia) {
        this.nombreParroquia = nombreParroquia;
    }

    public Canton getCanton() {
        return this.canton;
    }

    public void setCanton(Canton canton) {
        this.canton = canton;
    }

    public Parroquia canton(Canton canton) {
        this.setCanton(canton);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Parroquia)) {
            return false;
        }
        return id != null && id.equals(((Parroquia) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Parroquia{" +
            "id=" + getId() +
            ", nombreParroquia='" + getNombreParroquia() + "'" +
            "}";
    }
}
