Meteor.startup(function() {

  famous.polyfills;
  famous.core.famous;

  // CORE
  var mainContext       = famous.core.Engine.createContext();
  var Modifier          = famous.core.Modifier;
  var Surface           = famous.core.Surface;
  var Transform         = famous.core.Transform;

  // MODIFIERS
  var StateModifier     = famous.modifiers.StateModifier;
  var ModifierChain     = famous.modifiers.ModifierChain;

  // VIEWS
  var RenderController  = famous.views.RenderController;

  // TRANSITIONS
  var Transitionable    = famous.transitions.Transitionable;
  var Easing            = famous.transitions.Easing;

  // UTILITIES
  var Timer             = famous.utilities.Timer;

  // DEFAULT_TRANSITION
  var defaultTransition = {curve: Easing.inOutQuad, duration: 200};
  var secondaryTransition = {curve: Easing.outElastic, duration: 1000};
  var instantTransition = {duration: 0};
  
  // KEEP TRACK OF MAIN WINDOW VIEW & PREVIEW WINDOWS
  var currentPane = 0;

/************ SURFACES | START ************/

/* BACKGROUND SURFACE */
  var backgroundSurface = new Surface({
    properties: {background: "#444"}
  });

/* PANE SCALER */
  var menuButton = new Surface({
    size: [30,30],
    properties: {
      border: '2px solid #000',
      borderRadius: '30px',
      zIndex: 10
    },
    isOpen: false
  });

/* WINDOW SURFACES */
  var windowPanes = ['green', 'red', 'blue', 'yellow', 'purple'].map(function (color, index) {
    var paneName = ['Listings', 'Deals', 'Contacts', 'Schedule', 'Dashboard'];
    var pane = new Surface({
      size: [undefined, undefined],
      properties: {
        backgroundColor: color
      },
      content: "<h1 style='margin-left: 1em;'>" + paneName[index] + ": " + color + "</h1>"
    });
    pane.parentView = undefined;
    return pane;
  });

/************ SURFACES |  END  ************/

/************ VIEWS | START ************/

  var allViews = ['activePane', 'previewOne', 'previewTwo', 'previewThree', 'previewFour'].map(
    function (view, index, array) {
      var renderController = new RenderController({
        inTransition: defaultTransition,
        outTransition: defaultTransition,
        overlap: true
      });
      renderController.inView = undefined;
      return renderController;
    });

/************ VIEWS |  END  ************/

/************ MODIFIERS | START ************/

  menuButton.stateMod = new StateModifier();
  menuButton.stateMod.setAlign([0.01, 0.975]);
  menuButton.stateMod.setOrigin([0.01, 0.975]);

  allViews[0].stateMod = new StateModifier();
  allViews[0].stateMod.setAlign([1, 0]);
  allViews[0].stateMod.setOrigin([1, 0]);

  allViews[1].stateMod = new StateModifier();
  allViews[1].stateMod.setAlign([0.3, 1.2]);
  allViews[1].stateMod.setOrigin([0.3, 1.2]);
  allViews[1].stateMod.setTransform(Transform.scale(0.15,0.15,1), instantTransition);

  allViews[2].stateMod = new StateModifier();
  allViews[2].stateMod.setAlign([0.5125, 1.2]);
  allViews[2].stateMod.setOrigin([0.5125, 1.2]);
  allViews[2].stateMod.setTransform(Transform.scale(0.15,0.15,1), instantTransition);

  allViews[3].stateMod = new StateModifier();
  allViews[3].stateMod.setAlign([0.725, 1.2]);
  allViews[3].stateMod.setOrigin([0.725, 1.2]);
  allViews[3].stateMod.setTransform(Transform.scale(0.15,0.15,1), instantTransition);

  allViews[4].stateMod = new StateModifier();
  allViews[4].stateMod.setAlign([0.9375, 1.2]);
  allViews[4].stateMod.setOrigin([0.9375, 1.2]);
  allViews[4].stateMod.setTransform(Transform.scale(0.15,0.15,1), instantTransition);

/************ MODIFIERS | END ************/

/************ EVENTS | START ************/

  menuButton.on('click', function () {
    allViews[0].stateMod.setTransform(Transform.scale(0.8, 0.8, 1), defaultTransition);

    Timer.setTimeout(function(){
      allViews[1].stateMod.setAlign([0.3, 0.975], defaultTransition);
      allViews[1].stateMod.setOrigin([0.3, 0.975], defaultTransition);
    }, 0);
    Timer.setTimeout(function(){
      allViews[2].stateMod.setAlign([0.5125, 0.975], defaultTransition);
      allViews[2].stateMod.setOrigin([0.5125, 0.975], defaultTransition);
    }, 50);
    Timer.setTimeout(function(){
      allViews[3].stateMod.setAlign([0.725, 0.975], defaultTransition);
      allViews[3].stateMod.setOrigin([0.725, 0.975], defaultTransition);
    }, 100);

    Timer.setTimeout(function(){
      allViews[4].stateMod.setAlign([0.9375, 0.975], defaultTransition);
      allViews[4].stateMod.setOrigin([0.9375, 0.975], defaultTransition);
    }, 150);

    menuButton.stateMod.setOpacity(0, defaultTransition);
    menuButton.setProperties({zIndex: -10});
    menuButton.isOpen = !menuButton.isOpen;
  });

  menuButton.on('mouseover', function () {
    menuButton.setProperties({background: "#000"});
  });

  menuButton.on('mouseout', function () {
    menuButton.setProperties({background: "none"});
  });

  windowPanes.forEach(function (pane) {
    pane.on('click', function () {
      if (menuButton.isOpen) {
        var clickedPane = this;
        var paneViewIndex;
        var paneSurfaceIndex;

        allViews.forEach(function (view, index, array) {
          if (view.inView === clickedPane) {
            paneViewIndex = index; 
          }
        });

        windowPanes.forEach(function (surface, index, array) {
          if (surface === clickedPane) {
            paneSurfaceIndex = index; 
          }
        });

        if (pane !== allViews[0].inView) {
          allViews[0].show(this);
          allViews[paneViewIndex].show(windowPanes[currentPane]);
          allViews[0].inView = this;
          allViews[paneViewIndex].inView = windowPanes[currentPane];
          currentPane = paneSurfaceIndex;
        }

          allViews[0].stateMod.setTransform(Transform.scale(1, 1, 1), defaultTransition);
          allViews[1].stateMod.setAlign([0.3, 1.2], defaultTransition);
          allViews[1].stateMod.setOrigin([0.3, 1.2], defaultTransition);
          allViews[2].stateMod.setAlign([0.5125, 1.2], defaultTransition);
          allViews[2].stateMod.setOrigin([0.5125, 1.2], defaultTransition);
          allViews[3].stateMod.setAlign([0.725, 1.2], defaultTransition);
          allViews[3].stateMod.setOrigin([0.725, 1.2], defaultTransition);
          allViews[4].stateMod.setAlign([0.9375, 1.2], defaultTransition);
          allViews[4].stateMod.setOrigin([0.9375, 1.2], defaultTransition);
          menuButton.isOpen = !menuButton.isOpen;

        Timer.setTimeout(function() {
          menuButton.stateMod.setOpacity(1, defaultTransition);
          menuButton.setProperties({zIndex: 10});
        }, 100);
      }
    });
  });

/************ EVENTS | END ************/

/************ INIT & BUILD TREE |  START  ************/

/* INIT */
allViews.forEach(function (view, index, array) {
  view.show(windowPanes[index]);
  view.inView = windowPanes[index];
  windowPanes[index].parentView = allViews[index];
});

/* BUILD RENDER TREE */
  mainContext.add(backgroundSurface);
  mainContext.add(allViews[1].stateMod).add(allViews[1]);
  mainContext.add(allViews[2].stateMod).add(allViews[2]);
  mainContext.add(allViews[3].stateMod).add(allViews[3]);
  mainContext.add(allViews[4].stateMod).add(allViews[4]);
  mainContext.add(allViews[0].stateMod).add(allViews[0]);
  mainContext.add(menuButton.stateMod).add(menuButton);

/************ INIT & BUILD TREE |  END  ************/

}); // End of Meteor.startup()