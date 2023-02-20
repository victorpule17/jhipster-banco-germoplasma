package com.victorpule.germoplasma.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Canton.
 */
@Entity
@Table(name = "canton")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Canton implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre_canton")
    private String nombreCanton;

    @ManyToOne
    @JsonIgnoreProperties(value = { "pais" }, allowSetters = true)
    private Provincia provincia;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Canton id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCanton() {
        return this.nombreCanton;
    }

    public Canton nombreCanton(String nombreCanton) {
        this.setNombreCanton(nombreCanton);
        return this;
    }

    public void setNombreCanton(String nombreCanton) {
        this.nombreCanton = nombreCanton;
    }

    public Provincia getProvincia() {
        return this.provincia;
    }

    public void setProvincia(Provincia provincia) {
        this.provincia = provincia;
    }

    public Canton provincia(Provincia provincia) {
        this.setProvincia(provincia);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Canton)) {
            return false;
        }
        return id != null && id.equals(((Canton) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Canton{" +
            "id=" + getId() +
            ", nombreCanton='" + getNombreCanton() + "'" +
            "}";
    }
}
