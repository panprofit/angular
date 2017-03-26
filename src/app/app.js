import angular from 'angular';
import slider from 'angularjs-slider';
import style from '../style/app.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor() {
    this.items = [];
    this.sliderOptions = {
      floor: 0,
      ceil: 100,
	    step: 0.01,
      precision: 2,
	    translate: function(value) {
		    return `${value}%`;
	    },
      onChange: this.calc.bind(this)
    }
  }

  addItem() {
    this.items.push({'Name': `Item${this.items.length + 1}`,'Percent': 0});
    this.items.forEach(item => item['Percent'] = 0);
    this.items[0]['Percent'] = 100;
  }

  getOptions(index) {
    return angular.extend({}, this.sliderOptions, {id: index});
  }

  calc(index) {
    if (this.items.length > 1) {
	    let diff = this.items
		    .map(item => item['Percent'])
		    .reduce((a, b) => a + b, -100)
		    .toFixed(2);
	    const sorted = this.items
		    .map((item, idx) => ({index: idx, value: item['Percent']}))
		    .filter(item => item.index !== index)
		    .sort((a, b) => diff < 0? a.value - b.value: b.value - a.value);
	    sorted.forEach(item => {
	    	if (item.value < diff) {
	    		this.items[item.index]['Percent'] = 0;
	    		diff -= item.value;
		    } else {
	    		this.items[item.index]['Percent'] -= diff;
	    		diff = 0;
		    }
	    });
    }
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, ['rzModule'])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;