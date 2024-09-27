const svg = document.getElementById('vis');

const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
circle.setAttribute('cx', '400');
circle.setAttribute('cy', '250');
circle.setAttribute('r', '50');
circle.setAttribute('fill', 'orange');
svg.appendChild(circle);


//create a random number of circles of random sizes filled with random colors
for (let i=0; i<Math.floor(Math.random() * 15) + 5; i++) {
    const circleGen = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleGen.setAttribute('cx', Math.floor(Math.random() * 700) + 50);
    circleGen.setAttribute('cy', Math.floor(Math.random() * 500) + 50);
    circleGen.setAttribute('r', Math.floor(Math.random() * 80) + 10);
    
    const r = Math.floor(Math.random() * 200) + 50;
    const g = Math.floor(Math.random() * 200) + 50;
    const b = Math.floor(Math.random() * 200) + 50;
    const rgb = 'rgb('+ r + ', ' + g + ', '+ b +')';

    circleGen.setAttribute('fill', rgb);
    svg.appendChild(circleGen);
}
    