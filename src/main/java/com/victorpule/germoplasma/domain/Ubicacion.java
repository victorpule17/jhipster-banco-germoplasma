package com.victorpule.germoplasma.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Ubicacion.
 */
@Entity
@Table(name = "ubicacion")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Ubicacion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "calle_principal")
    private String callePrincipal;

    @Column(name = "calle_secundaria")
    private String calleSecundaria;

    @Column(name = "latitud")
    private String latitud;

    @Column(name = "altitud")
    private String altitud;

    @Column(name = "longitud")
    private String longitud;

    @ManyToOne
    @JsonIgnoreProperties(value = { "canton" }, allowSetters = true)
    private Parroquia parroquia;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ubicacion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCallePrincipal() {
        return this.callePrincipal;
    }

    public Ubicacion callePrincipal(String callePrincipal) {
        this.setCallePrincipal(callePrincipal);
        return this;
    }

    public void setCallePrincipal(String callePrincipal) {
        this.callePrincipal = callePrincipal;
    }

    public String getCalleSecundaria() {
        return this.calleSecundaria;
    }

    public Ubicacion calleSecundaria(String calleSecundaria) {
        this.setCalleSecundaria(calleSecundaria);
        return this;
    }

    public void setCalleSecundaria(String calleSecundaria) {
        this.calleSecundaria = calleSecundaria;
    }

    public String getLatitud() {
        return this.latitud;
    }

    public Ubicacion latitud(String latitud) {
        this.setLatitud(latitud);
        return this;
    }

    public void setLatitud(String latitud) {
        this.latitud = latitud;
    }

    public String getAltitud() {
        return this.altitud;
    }

    public Ubicacion altitud(String altitud) {
        this.setAltitud(altitud);
        return this;
    }

    public void setAltitud(String altitud) {
        this.altitud = altitud;
    }

    public String getLongitud() {
        return this.longitud;
    }

    public Ubicacion longitud(String longitud) {
        this.setLongitud(longitud);
        return this;
    }

    public void setLongitud(String longitud) {
        this.longitud = longitud;
    }

    public Parroquia getParroquia() {
        return this.parroquia;
    }

    public void setParroquia(Parroquia parroquia) {
        this.parroquia = parroquia;
    }

    public Ubicacion parroquia(Parroquia parroquia) {
        this.setParroquia(parroquia);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ubicacion)) {
            return false;
        }
        return id != null && id.equals(((Ubicacion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ubicacion{" +
            "id=" + getId() +
            ", callePrincipal='" + getCallePrincipal() + "'" +
            ", calleSecundaria='" + getCalleSecundaria() + "'" +
            ", latitud='" + getLatitud() + "'" +
            ", altitud='" + getAltitud() + "'" +
            ", longitud='" + getLongitud() + "'" +
            "}";
    }
}
