package Services;

import model.PlanModal;
import model.SegmapAPIResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PlanningService {


    List<Object> getAccounts();
    List<Object> getPlanAccounts();

    SegmapAPIResponse addPlan(List<PlanModal> planModal);
}
