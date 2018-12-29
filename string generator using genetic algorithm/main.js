input = "dharmikjoshi";
length = input.length;
population = 40;
mutationRate = 0.2;
people = [];
pool = [];
exit = false;

function gen_rand(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
/*
var sliders = Array.from(document.getElementsByClassName("slider"));
for (var item in sliders) {
  sliders[item].getElementsByTagName("span")[0].innerHTML =
  sliders[item].getElementsByTagName("input")[0].value;
  sliders[item].oninput = function(){
      this.getElementsByTagName("span")[0].innerHTML =
      this.getElementsByTagName("input")[0].value;
  }
}
*/


class Person {
  constructor(name){
    this.name = name;
    this.fitness = -1;
  }
}

function init(){
  for (var i = 0; i < population; i++) {
    people.push(new Person(Math.random().toString(36).substr(2, length)));
  }
}

function calcFitness(){
  for (var i = 0; i < population; i++){
    var fitness_ = 0;
    for(var j = 0; j < length; j++){
      if(people[i].name.charAt(j) == input.charAt(j)) fitness_++;
    }
    people[i].fitness = fitness_;
    if(people[i].fitness == length) {
      exit = true;
      console.log(people[i].name + " found"+ people[i].fitness);
    }
  }
}

function generatePool(){
  pool = [];
  for(var i = 0; i < population; i++){
    pool.push(...Array(Math.pow(Math.floor(people[i].fitness), 2)).fill(people[i]))
  }
  console.log(pool);
}

function crossOver() {
  newPeople = [];
  for(var i = 0; i < population; i++){
    var rand1 = gen_rand(0, pool.length-1);
    var rand2 = gen_rand(0, pool.length-1);
    var parent1 = pool[rand1];
    var parent2 = pool[rand2];
    console.log(parent1, parent2);
    var rand = gen_rand(1, length-1);
    var child = parent1.name.substr(0, rand) + parent2.name.substr(rand);
    newPeople.push(new Person(child));
  }
  people = newPeople;
}

function mutation(){
  for(var i = 0; i < population; i++){
    var mutate = Math.random();
    if(mutate < mutationRate){
      var rand = gen_rand(0, length-1);
      people[i].name = people[i].name.substr(0, rand) +
                        Math.random().toString(36).substr(2, 1) +
                        people[i].name.substr(rand+1)
    }
  }
}

function showElements(){
  doc = document.getElementsByClassName("output")[0];
  while(doc.firstChild && doc.removeChild(doc.firstChild));
  var p = document.createElement("p");
  p.innerHTML = "generation: " + gen;
  doc.appendChild(p)
  console.log(gen);
  for (var i = 0; i < population; i++) {
    var p = document.createElement("p");
    p.innerHTML = "name: " + people[i].name + " fitness: " + people[i].fitness;
    doc.appendChild(p)
  }
}



// MAIN
init();
var gen = 1;
  inter = setInterval(function(){
    calcFitness();
    showElements();
    if(exit) clearInterval(inter);
    generatePool();
    crossOver();
    mutation();

    gen++;
  },100);

showElements();
