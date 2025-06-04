const React = require('react')
const {ApiClient} = require("adminjs")

module.exports = function Dashboard() {
  const [data, setData] = React.useState(null)
  const api = new ApiClient()

  React.useEffect(() => {
    api.getDashboard()
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        console.log(error)
      });
  }, [])

  const dashboardHTML = `
    <div class="dashboard-container">
      <style>
        .dashboard-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 20px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 20px;
        }
        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #2c3e50;
          margin: 16px 0;
        }
        .stat-label {
          color: #7f8c8d;
          font-size: 16px;
        }
        .dashboard-title {
          font-size: 24px;
          color: #2c3e50;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ecf0f1;
        }
        @media (max-width: 576px) {
          .stats-grid {
            grid-template-columns: repeat(1, 1fr);
          }
        }
      </style>
      
      <h1 class="dashboard-title">Статистика магазина</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${data?.usersCount}</div>
          <div class="stat-label">Пользователей</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">${data?.ordersCount}</div>
          <div class="stat-label">Заказов</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">${data?.productsCount}</div>
          <div class="stat-label">Товаров</div>
        </div>
      </div>
    </div>
  `

  return React.createElement("div", {
    dangerouslySetInnerHTML: {__html: dashboardHTML}
  })
}