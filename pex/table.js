function calculateSumByGenderAndGroup(data) {
    const result = {};
  
    data.forEach(entry => {
        const genderKey = entry.gender;
        const groupKey = entry.group;
  
        result[genderKey] = result[genderKey] || { math: 0, reading: 0, writing: 0, groups: {} };
        result[genderKey].groups[groupKey] = result[genderKey].groups[groupKey] || { math: 0, reading: 0, writing: 0 };
  
        result[genderKey].math += parseInt(entry['math score'], 10);
        result[genderKey].reading += parseInt(entry['reading score'], 10);
        result[genderKey].writing += parseInt(entry['writing score'], 10);
  
        result[genderKey].groups[groupKey].math += parseInt(entry['math score'], 10);
        result[genderKey].groups[groupKey].reading += parseInt(entry['reading score'], 10);
        result[genderKey].groups[groupKey].writing += parseInt(entry['writing score'], 10);
    });
  
    return result;
  }
  
  function createRow(label, values, isBold) {
    const row = document.createElement('tr');
  
    // Add hover effect and background color styles
    row.addEventListener('mouseover', function () {
      this.style.backgroundColor = 'lightgray'; 
    });
  
    row.addEventListener('mouseout', function () {
      this.style.backgroundColor = ''; 
    });
  
    row.innerHTML = `
        <td ${isBold ? 'style="font-weight: bold;"' : ''}>${label}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ''}>${values.math}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ''}>${values.reading}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ''}>${values.writing}</td>
    `;
  
    return row;
  }
  function createRow2(label, values, isBold) {
    const row = document.createElement('tr');
  
    // Add hover effect and background color styles
    row.addEventListener('mouseover', function () {
      this.style.backgroundColor = 'lightgray'; 
    });
  
    row.addEventListener('mouseout', function () {
      this.style.backgroundColor = ''; 
    });
  
    row.innerHTML = `
        <td ${isBold ? 'style="font-weight: bold;"' : ''}>${label}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ''}>${values.male}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ''}>${values.female}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ''}>${values.Grand_Total}</td>
    `;
  
    return row;
  }
  
  
  function renderTable(data) {
    const sumByGenderAndGroup = calculateSumByGenderAndGroup(data);
    const tableBody = document.getElementById('data-table-body');
  
    let grandTotal = { math: 0, reading: 0, writing: 0 }; // Khởi tạo giá trị grand total
  
    Object.entries(sumByGenderAndGroup).forEach(([gender, values]) => {
        if (['male', 'female'].includes(gender)) {
            tableBody.appendChild(createRow(gender, values, true));
        }
  
        Object.entries(values.groups).forEach(([group, groupValues]) => {
            if (['group A', 'group B', 'group C', 'group D', 'group E'].includes(group)) {
                tableBody.appendChild(createRow(group, groupValues, false));
  
                // Cập nhật grand total
                grandTotal.math += groupValues.math;
                grandTotal.reading += groupValues.reading;
                grandTotal.writing += groupValues.writing;
            }
        });
    });
  
    // Thêm dòng cuối cùng với grand total
    tableBody.appendChild(createRow('Grand Total', grandTotal, true));
  }
  
  function calculateAverageByDegree(data) {
    const result = {};
  
    data.forEach(entry => {
      const genderKey = entry.gender;
      const groupKey = entry.parent_degrees;
      const sumAvg = parseFloat(entry['Sum_avg']);
  
      result[groupKey] = result[groupKey] || { male: 0, female: 0, Grand_Total: 0, count: 0, countmale: 0, countfemale: 0 };
  
      result[groupKey].male += genderKey === 'male' ? sumAvg : 0;
      result[groupKey].countmale += genderKey === 'male' ? 1 : 0;
      result[groupKey].female += genderKey === 'female' ? sumAvg : 0;
      result[groupKey].countfemale += genderKey === 'female' ? 1 : 0;
      result[groupKey].Grand_Total += sumAvg;
      result[groupKey].count += 1;  // Tăng số mục
    });
  
    // Tính trung bình và làm tròn số
    Object.keys(result).forEach(groupKey => {
      const group = result[groupKey];
      if (group.count > 0) {
        group.male = parseFloat((group.male / group.countmale).toFixed(2));
        group.female = parseFloat((group.female / group.countfemale).toFixed(2));
        group.Grand_Total = parseFloat((group.Grand_Total / group.count).toFixed(2));
      }
      delete group.count;  // Xóa số mục để tránh in ra trong bảng
    });
  
    return result;
  }
  
  function getDataFromTable(tableId) {
    var table = document.getElementById(tableId);
  
    if (!table) {
        console.error("Table with ID '" + tableId + "' not found.");
        return;
    }
  
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var dataTable = [];
  
    // Lặp qua từng hàng và lấy dữ liệu
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var rowData = {};
  
        // Lặp qua từng ô trong hàng và lấy giá trị
        for (var j = 0; j < cells.length; j++) {
            var columnName = table.getElementsByTagName('thead')[0].getElementsByTagName('th')[j].textContent;
            rowData[columnName] = cells[j].textContent;
        }
  
        dataTable.push(rowData);
    }
  
    return dataTable
  
    // Bạn có thể thêm các xử lý khác ở đây nếu cần
  }
  
  
  function renderDegreeTable(data) {
    const sumByDegree = calculateAverageByDegree(data);
    const degreeTableBody = document.getElementById('data_table_2');
  
    let degreeGrandTotal = { male: 0, female: 0, Grand_Total: 0 };
  
    Object.entries(sumByDegree).forEach(([parent_degrees, values]) => {
      if (["bachelor's degree", "some college","master's degree","associate's degree","high school","some high school"].includes(parent_degrees)) {
        degreeTableBody.appendChild(createRow2(parent_degrees, values, false));
      }
      // Assume createRow2 is a function that works correctly with the structure of values
      degreeGrandTotal.male += values.male || 0;
      degreeGrandTotal.female += values.female || 0;
      degreeGrandTotal.Grand_Total += values.Grand_Total || 0;
    });
  
    // Tính trung bình cho Grand Total
    degreeGrandTotal.male /= Object.keys(sumByDegree).reduce((count, key) => count + sumByDegree[key].countmale, 0) || 1;
    degreeGrandTotal.female /= Object.keys(sumByDegree).reduce((count, key) => count + sumByDegree[key].countfemale, 0) || 1;
    degreeGrandTotal.Grand_Total /= Object.keys(sumByDegree).reduce((count, key) => count + sumByDegree[key].count, 0) || 1;
  
    degreeTableBody.appendChild(createRow2('Grand Total', degreeGrandTotal, true));
  }
  
    // Fetch data from CSV file
    fetch('./main_data.csv')
    .then(response => response.text())
    .then(csv => {
        // Parse CSV data
        Papa.parse(csv, {
            header: true,
            complete: function (result) {
                const data = result.data;
                renderTable(data);
                renderDegreeTable(data);
            }
        });
  
        $('#data-table').DataTable({
          data: getDataFromTable('data-table'),
          columns: [
              { data: 'Row Labels' },
              { data: 'Sum of math score' },
              { data: 'Sum of reading score' },
              { data: 'Sum of writing score' }, // Adjust column names accordingly
          ],
          searching: false,
          ordering: false,
          paging: true,
          info: true,
          createdRow: (row, data, index) => {
            boldRows = [0,6,12];
            if (boldRows.includes(index)) {
                $(row).addClass('bold-row');
            }
        }
      });
      
  
      $('#data_table_degree').DataTable({
          data:  getDataFromTable('data_table_degree') ,
          columns: [
              { data: 'Row Labels' },
              { data: 'male' },
              { data: 'female' },
              { data: 'Grand Total' },
          ],
          searching: false,
          ordering: true,
          // order: [[1, 'desc']],
          paging: true,
          info: true,
          createdRow: (row, data, index) => {
              // Adjust index based on the actual number of columns
            
          },
          drawCallback: (settings) => {
            const grandTotalRow = $('#data_table_degree tbody tr:contains("Grand Total")');
        
            if (grandTotalRow.length > 0) {
                grandTotalRow.css('font-weight', 'bold').detach().appendTo($('#data_table_degree tbody'));
            }
        },      
      });
    });

    function calculateAndDisplayAverages(csvFilePath) {
        d3.csv(csvFilePath).then(function (data) {
            // Tính trung bình cho nhóm "Free/Reduced"
            var freeReduceData = data.filter(function (d) {
                return d.lunch === "free/reduced";
            });
            var freeReduceAvg = d3.mean(freeReduceData, function (d) {
                return +d.Sum_avg; // Chuyển đổi sang số
            });
    
            // Tính trung bình cho nhóm "Standard"
            var standardData = data.filter(function (d) {
                return d.lunch === "standard";
            });
            var standardAvg = d3.mean(standardData, function (d) {
                return +d.Sum_avg; // Chuyển đổi sang số
            });
    
            // Cập nhật giá trị vào các id tương ứng trên trang
            d3.select(".Free_Reduce").text(freeReduceAvg.toFixed(2));
            d3.select(".Standard").text(standardAvg.toFixed(2));
        });
    }
    
    // Sử dụng hàm với đường dẫn đến tệp CSV của bạn
    calculateAndDisplayAverages("./main_data.csv");
    