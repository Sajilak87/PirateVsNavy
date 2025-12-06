const routeLinks = document.querySelectorAll('.route-list li a');

routeLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Route ${index + 1} selected!`);
    });
});

const routesData = await routesRes.json();
        console.log("Generated routes:", routesData);
        alert(`Routes fetched! Check console for details.`);

      } catch (err) {
        console.error("API error:", err);
        alert("Error calling APIs. Check console.");
      }
    });