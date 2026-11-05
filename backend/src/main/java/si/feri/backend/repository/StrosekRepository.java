package si.feri.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import si.feri.backend.model.Strosek;

public interface StrosekRepository extends JpaRepository<Strosek, Long> {

    List<Strosek> findByKategorija(String kategorija);

    List<Strosek> findByDatum(LocalDate datum);

    List<Strosek> findByKategorijaAndDatum(String kategorija, LocalDate datum);

    @Query("SELECT s.kategorija AS kategorija, SUM(s.znesek) AS skupaj " +
           "FROM Strosek s GROUP BY s.kategorija")
    List<KategorijaSkupaj> vsotaPoKategorijah();
}
