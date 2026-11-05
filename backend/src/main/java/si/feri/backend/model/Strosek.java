package si.feri.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;
import java.time.LocalDate;

@Entity 
public class Strosek {
@Id 
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String naslov;
    private double znesek;
    private String kategorija;
    private LocalDate datum;
    private String opis;
    
    public Strosek(String naslov, double znesek, String kategorija, LocalDate datum, String opis) {
        this.naslov = naslov;
        this.znesek = znesek;
        this.kategorija = kategorija;
        this.datum = datum;
        this.opis = opis;
    }

    public Strosek() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNaslov() {
        return naslov;
    }

    public void setNaslov(String naslov) {
        this.naslov = naslov;
    }

    public double getZnesek() {
        return znesek;
    }

    public void setZnesek(double znesek) {
        this.znesek = znesek;
    }

    public String getKategorija() {
        return kategorija;
    }

    public void setKategorija(String kategorija) {
        this.kategorija = kategorija;
    }

    public LocalDate getDatum() {
        return datum;
    }

    public void setDatum(LocalDate datum) {
        this.datum = datum;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

}
