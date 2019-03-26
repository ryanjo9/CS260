Vue.component('star-rating', VueStarRating.default);
let queryUrl = `https://www.google.com/maps/dir/?api=1&&destination=`;
const activity = {
  sports: 0,
  hikes: 1,
  //astronomy: 2,
  drives: 2,
  //music: 4,
  wut: 3,
};
let app = new Vue({
  el: '#app',
  data: {
    activities: [
      //SPORTS
      [{
        name: "Curling",
        price: "Price: $15",
        directions: `https://www.google.com/maps/dir/?api=1&&destination=Utah+Olympic+Oval`,
        googleDetails: `https://www.google.com/maps/search/?api=1&query=Utah+Olympic+Oval`,
        description: "The Utah Olympic Oval Learn to Curl Program is a great way to learn the sport. This two hour on-ice class teaches the fundamentals of curling - including proper delivery, sweeping and basic strategy - and is taught by Utah Olympic Oval certified instructors. This program follows lesson and skill development established by USA Curling. For beginners, this program is ideal for date night or with a group of friends.",
        when: "Fridays at 7:00pm",
      }, {
        name: "Top Golf",
        price: "Price: $15",
        directions: `https://www.google.com/maps/dir/?api=1&&destination=Top+Golf`,
        googleDetails: `https://www.google.com/maps/search/?api=1&query=top+golf`,
        description: "You want unlimited game play, discounted food & drinks, and some space just for college students? You got it! A $15 cover gets you all that and more every Wednesday during College Night. Student ID required.",
        when: "Wednesdays 7pm-11pm",
      }],
      //hikes
      [{
        name: "Grotto Falls Trail",
        price: 'Price: $0',
        directions: `https://www.google.com/maps/dir/?api=1&&destination=Grotto+Falls+Trail`,
        googleDetails: `https://www.google.com/maps/search/?api=1&query=Grotto+Falls+Trail`,
        description: "Grotto Falls trail follows a small stream and curves its way through the forest crossing stream on large timbers put in place by the forest service. At the end of the trail you are greeted with a beautiful water fall cascading into a small pool of water, surrounded by steep rock walls.",
        when: "Anytime. Though hikes aren't the funnest in the winter.",
      }, {
        name: "Horsetail Falls",
        price: 'Price: $0',
        directions: `https://www.google.com/maps/dir/?api=1&&destination=Horsetail+Falls`,
        googleDetails: `https://www.google.com/maps/search/?api=1&query=Horsetail+Falls`,
        description: "Horsetail Falls Trail is a 3.9 mile moderately trafficked out and back trail located near Alpine, Utah that features a waterfall and is rated as moderate. The trail offers a number of activity options. Dogs are also able to use this trail but must be kept on leash.",
        when: "Trail is best used from March until October",
      }],
      //Drives
      [{
        name: "Tibblefork Resevoir",
        price: '',
        directions: `https://www.google.com/maps/dir/?api=1&&destination=Tibblefork+Resevoir`,
        googleDetails: `https://www.google.com/maps/search/?api=1&query=Tibblefork+Resevoir`,
        description: `Beautiful resevoir located up American Fork Canyon. Nestled in the scenic Wasatch Mountains, Tibble Fork offers spectacular views and frequented for its photographic opportunities.`,
        when: `Check for road closures in the winter.`,
      }, {
        name: "Bonneville Salt Flats",
        directions: `https://www.google.com/maps/dir/?api=1&&destination=Bonneville+Salt+Flats`,
        googleDetails: `https://www.google.com/maps/search/?api=1&query=Bonneville+Salt+Flats`,
        description: "The Salt Flats were formed when ancient lake Lake Bonneville dried up. The lake was huge, filling much of the Great Basin. It eventually shrank below its outlet and so its water became salty. As water continued to evaporate, salt deposits were left in many areas. The Great Salt Lake is a remnant of Lake Bonneville. Several roads probe the Salt Flats from many directions. They often extend into very remote locations where conditions are harsh and there are no services."
      }],
      //Music category when there's more stuff
      //Astronomy category when there's more stuff
      //wut
      [{
        name: "Fruit Ninja",
        price: "Price: Depends on the fruit",
        description: "Grab a butter knife, have someone toss a fruit at you, and slice. Yes, it works."
      }, {
        name: "Paper Boat Contest",
        price: "Price: Depends on the paper you use",
        description: "Make a boat out of paper and compete to see which boat will last the longest. Not uncommon for well made boats to last over an hour."
      }, {
        name: "Explode a watermelon",
        price: "One watermeon and a few hundred rubberbands.",
        description: "Wrap rubberbands around a watermelon until it explodes. Takes about half an hour and usually takes 450-700 rubberbands."
      }]
    ],
    categoryName: 'SPORTS',
    newName: '',
    newDescription: '',
    newPrice: '',
    selection: activity.sports,
  },
  computed: {
    selectedActivity() {
      if (this.categoryName === "RANDOM") {
        let randomItems = new Array;
        //Gets random number for category and item in category
        let firstCategoryIndex = Math.floor(Math.random() * (Object.keys(activity).length - 0));
        let firstItemIndex = Math.floor(Math.random() * (this.activities[firstCategoryIndex].length - 0));
        randomItems.push(this.activities[firstCategoryIndex][firstItemIndex]);

        let secondCategoryIndex = Math.floor(Math.random() * (Object.keys(activity).length - 0));
        let secondItemIndex = firstItemIndex;
        while (firstCategoryIndex === secondCategoryIndex) {
          secondCategoryIndex = Math.floor(Math.random() * (Object.keys(activity).length - 0));
        }
        secondItemIndex = Math.floor(Math.random() * (this.activities[secondCategoryIndex].length - 0))
        randomItems.push(this.activities[secondCategoryIndex][secondItemIndex]);
        this.selection = activity.hikes;
        return randomItems;
      }
      return this.activities[this.selection];
    }
  },
  methods: {
    addItem() {
      if (this.checkInput()) {
        this.activities[this.selection].push({
          name: this.newName,
          price: this.newPrice ? `Price: $${this.newPrice === '' ? 0 : this.newPrice}` : '',
          directions: this.directionsLink(this.newName),
          googleDetails: this.reviewsLink(this.newName),
          description: this.newDescription
        });
      }
      this.newName = '';
      this.newDescription = '';
      this.newPrice = '';
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
    chooseAstronomy() {
      this.selection = activity.astronomy;
      this.categoryName = 'ASTRONOMY';
    },
    chooseMusic() {
      this.selection = activity.music;
      this.categoryName = 'MUSIC';
    },
    chooseWut() {
      this.selection = activity.wut;
      this.categoryName = 'WUT';
    },
    chooseRandom() {
      this.categoryName = 'RANDOM';
    }


  }



});