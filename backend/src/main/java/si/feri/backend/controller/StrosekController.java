package si.feri.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import si.feri.backend.repository.StrosekRepository;
import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

import si.feri.backend.model.Strosek;
import si.feri.backend.repository.KategorijaSkupaj;
import si.feri.backend.repository.StrosekRepository;


@CrossOrigin(origins = "http://localhost:3000")
@RestController 
@RequestMapping ("/strosek")
public class StrosekController {
    private final StrosekRepository strosekRepository;

    public StrosekController(StrosekRepository strosekRepository) {
        this.strosekRepository = strosekRepository;
    }

    @GetMapping
    public List<Strosek> getStroski(
            @RequestParam(required = false) String kategorija,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datum) {

        if (kategorija != null && datum != null) {
            return strosekRepository.findByKategorijaAndDatum(kategorija, datum);
        } else if (kategorija != null) {
            return strosekRepository.findByKategorija(kategorija);
        } else if (datum != null) {
            return strosekRepository.findByDatum(datum);
        }
        return strosekRepository.findAll();
    }

    @GetMapping("/po-kategorijah")
    public List<KategorijaSkupaj> getPoKategorijah() {
        return strosekRepository.vsotaPoKategorijah();
    }
        
    @PostMapping 
    public Strosek dodajStrosek(@RequestBody Strosek strosek){
        return strosekRepository.save(strosek);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Strosek> dobiStrosek(@PathVariable long id){
        return strosekRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Strosek> spremeniStrosek(@PathVariable long id, @RequestBody Strosek strosek){
        return strosekRepository.findById(id)
        .map( obstojec ->{
            obstojec.setNaslov(strosek.getNaslov());
            obstojec.setZnesek(strosek.getZnesek());
            obstojec.setKategorija(strosek.getKategorija());
            obstojec.setDatum(strosek.getDatum());
            obstojec.setOpis(strosek.getOpis());
            Strosek shrani = strosekRepository.save(obstojec);
            return  ResponseEntity.ok(shrani);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Strosek> izbrisiStrosek(@PathVariable long id){
        if (!strosekRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
        }
        strosekRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
