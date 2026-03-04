package service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface GetColumnsService {

    List<Map<String, Object>> getSelectedColumns(List<String> columns);

}
