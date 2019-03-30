Vue.component('star-rating', VueStarRating.default);
let queryUrl = `https://www.google.com/maps/dir/?api=1&&destination=`;
const activity = {
  sports: 'sports',
  hikes: 'hikes',
  //astronomy: 2,
  drives: 'drives',
  //music: 4,
  wut: 'wut',
};
let app = new Vue({
  el: '#app',
  data: {
    activities: {
      sports: [],
      hikes: [],
      drives: [],
      wut: [],
    },
    categoryName: 'SPORTS',
    newName: '',
    newDescription: '',
    newPrice: '',
    selection: activity.sports,
    newTime: '',
  },
  created() {
    this.getItems();
  },
  computed: {
    selectedActivity() {
      if (this.categoryName === "RANDOM") {
        let randomItems = new Array;
        //Gets random number for category and item in category

        let keys = Object.keys(activity)
        let first = activity[keys[keys.length * Math.random() << 0]];
        let second = activity[keys[keys.length * Math.random() << 0]];
        while (second === first) {
          second = activity[keys[keys.length * Math.random() << 0]];
        }

        let firstActivities = this.activities[first];
        let secondActivities = this.activities[second];
        randomItems.push(firstActivities[firstActivities.length * Math.random() << 0])
        randomItems.push(secondActivities[secondActivities.length * Math.random() << 0])





        // let firstCategoryIndex = Math.floor(Math.random() * (Object.keys(activity).length - 0));
        // let firstItemIndex = Math.floor(Math.random() * (this.activities[firstCategoryIndex].length - 0));
        // randomItems.push(this.activities[firstCategoryIndex][firstItemIndex]);
        //
        // let secondCategoryIndex = Math.floor(Math.random() * (Object.keys(activity).length - 0));
        // let secondItemIndex = firstItemIndex;
        // while (firstCategoryIndex === secondCategoryIndex) {
        //   secondCategoryIndex = Math.floor(Math.random() * (Object.keys(activity).length - 0));
        // }
        // secondItemIndex = Math.floor(Math.random() * (this.activities[secondCategoryIndex].length - 0))
        // randomItems.push(this.activities[secondCategoryIndex][secondItemIndex]);
        //this.selection = activity.hikes;
        return randomItems;
      }
      return this.activities[this.selection];
    }
  },
  methods: {
    async addItem() {
      if (this.checkInput()) {
        try {
          let r1 = await axios.post('/api/items', {
            category: this.selection,
            name: this.newName,
            description: this.newDescription,
            price: this.newPrice ? `Price: $${this.newPrice === '' ? 0 : this.newPrice}` : '',
            directions: this.directionsLink(this.newName),
            googleDetails: this.reviewsLink(this.newName),
            when: this.newTime,
          });
          this.getItems();
        } catch (error) {
          console.log(error);
        }
      }
      this.newName = '';
      this.newDescription = '';
      this.newPrice = '';
      this.newTime = '';
    },
    async getItems() {
      try {
        const items = await axios.get('api/items');
        this.activities.sports = items.data.sports;
        this.activities.hikes = items.data.hikes;
        this.activities.drives = items.data.drives;
        this.activities.wut = items.data.wut;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    replaceSpaces(name) {
      return name.replace(/ /g, "+");
    },
    directionsLink(name) {
      if (this.selection !== activity.wut) {
        return 'https://www.google.com/maps/dir/?api=1&&destination=' + this.replaceSpaces(name);
      } else {
        return undefined;
      }
    },
    reviewsLink(name) {
      console.log(this.selection);
      console.log(activity.wut);
      if (this.selection !== activity.wut) {
        return 'https://www.google.com/maps/search/?api=1&query=' + this.replaceSpaces(name);
      } else {
        return undefined;
      }
    },
    checkInput() {
      if (this.newName === '') {
        return false;
      } else {
        return true;
      }
    },
    chooseSports() {
      this.selection = activity.sports;
      this.categoryName = 'SPORTS';
    },
    chooseHikes() {
      this.selection = activity.hikes;
      this.categoryName = 'HIKES';
    },
    chooseDrives() {
      this.selection = activity.drives;
      this.categoryName = 'DRIVES';
    },
    chooseWut() {
      this.selection = activity.wut;
      this.categoryName = 'WUT';
    },
    chooseRandom() {
      this.categoryName = 'SPORTS';
      this.categoryName = 'RANDOM';
    }


  }



});