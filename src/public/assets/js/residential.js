const api_url = "http://localhost:3004/agents";

async function getapi(url) {
  try {
    const response = await fetch(url);
    const { data } = await response.json();
    console.log(data);
    if (!Array.isArray(data)) {
      throw new Error('API response is not an array');
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}

getapi(api_url).then((data) => {
  show(data);
});

function check(req, res, next) {
  const validRegions = ['east', 'west', 'north', 'south'];
  if (validRegions.includes(req.query.region)) {
    next();
  } else {
    res.status(400).send('Invalid region');
  }
}

function show(data) {
  let sortDirection = 1;
  let sortField = 'first_name';
  let regionFilter = null;

  const sortselect = document.getElementById('sortselect');
  const sortorder = document.getElementById('sortorder');
  const regionselect = document.getElementById('regionselect');

  sortselect.addEventListener('change', () => {
    sortField = sortselect.value;
    showData();
  });

  sortorder.addEventListener('change', () => {
    sortDirection = sortorder.value === 'ascending' ? 1 : -1;
    showData();
  });

  regionselect.addEventListener('change', () => {
    regionFilter = regionselect.value === 'all' ? null : regionselect.value;
    showData();
  });

  function showData() {
    let dataToShow = data;

    if (regionFilter) {
      dataToShow = dataToShow.filter(item => item.region === regionFilter);
    }

    // sort data based on selected field and sort direction
    dataToShow.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortDirection;
      if (a[sortField] > b[sortField]) return 1 * sortDirection;
      return 0;
    });

    let tab = `
      <table>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Region</th>
          <th>Rating</th>
          <th>Fee</th>
        </tr>
    `;

    for (let r of dataToShow) {
      let ratingColor = '';
      if (r.rating === 100) {
        ratingColor = 'green';
      } else if (r.rating >= 90) {
        ratingColor = 'blue';
      } else {
        ratingColor = 'purple';
      }
      tab += `
        <tr>
          <td>${r.first_name}</td>
          <td>${r.last_name}</td>
          <td>${r.region}</td>
          <td style="color: ${ratingColor};">${r.rating}%</td>
          <td>$${r.fee}</td>
        </tr>
      `;
    }

    tab += "</table>";
  
    document.getElementById("tableContainer").innerHTML = tab;
  }
  

  const regions = Array.from(new Set(data.map(item => item.region)));
  let options = '<option value="all">All</option>';
  for (let region of regions) {
    options += `<option value="${region}">${region}</option>`;
  }
  document.getElementById("regionselect").innerHTML = options;
}



















