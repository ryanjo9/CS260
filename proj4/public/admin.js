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
  el: '#admin',
  data: {
    activities: {
      sports: [],
      hikes: [],
      drives: [],
      wut: [],
    },
    categoryName: 'SPORTS',
    selection: activity.sports,
    newName: '',
    newDescription: '',
    newTime: '',
    newPrice: '',
    findItem: '',
    currentActivities: [],
  },
  created() {
    this.getItems();
  },
  computed: {
    selectedActivity() {
      return this.activities[this.selection];
    },
    editingItem() {
      return this.findItem
    }
  },
  methods: {
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
    selectItem(item) {
      this.findItem = item;
    },
    async editItem() {
      try {
        let response = await axios.put('/api/items/' + this.findItem._id, {
          name: this.newName,
          price: this.newPrice ? `Price: $${this.newPrice === '' ? 0 : this.newPrice}` : '',
          directions: this.directionsLink(this.newName),
          googleDetails: this.reviewsLink(this.newName),
          description: this.newDescription,
          when: this.newTime
        });
        this.findItem = null;
        this.getItems();
        this.clearEntries();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteItem(item) {
      try {
        let response = axios.delete('/api/items/' + this.findItem._id);
        this.findItem = '';
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    clearEntries() {
      this.newName = '';
      this.newDescription = '';
      this.newTime = '';
      this.newPrice = '';
      this.findItem = '';
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
    chooseSports() {
      this.clearEntries();
      this.selection = activity.sports;
      this.categoryName = 'SPORTS';
    },
    chooseHikes() {
      this.clearEntries();
      this.selection = activity.hikes;
      this.categoryName = 'HIKES';
    },
    chooseDrives() {
      this.clearEntries();
      this.selection = activity.drives;
      this.categoryName = 'DRIVES';
    },
    chooseWut() {
      this.clearEntries();
      this.selection = activity.wut;
      this.categoryName = 'WUT';
    },
  }
})