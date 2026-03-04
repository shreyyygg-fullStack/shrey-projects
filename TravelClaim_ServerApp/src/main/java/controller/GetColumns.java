package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import service.GetColumnsService;

import java.util.List;
import java.util.Map;
@ComponentScan(basePackages = { "service" })
@RestController
public class GetColumns {

    @Autowired
    GetColumnsService columnService;

    @PostMapping("/get-columns")
    public ResponseEntity<List<Map<String, Object>>> getColumns(@RequestBody ColumnRequest request) {
        List<Map<String, Object>> result = columnService.getSelectedColumns(request.getColumns());
        return ResponseEntity.ok(result);
    }

    public static class ColumnRequest {
        private List<String> columns;

        public List<String> getColumns() {
            return columns;
        }

        public void setColumns(List<String> columns) {
            this.columns = columns;
        }

}
}
