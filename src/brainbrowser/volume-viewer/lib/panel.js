/*
* BrainBrowser: Web-based Neurological Visualization Tools
* (https://brainbrowser.cbrain.mcgill.ca)
*
* Copyright (C) 2011
* The Royal Institution for the Advancement of Learning
* McGill University
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
* @author: Tarek Sherif
*/

/**
* @doc object
* @name panel
* @property {object} volume The volume being displayed.
* @property {string} axis The name of the axis being displayed (xspace, yspace or zspace).
* @property {object} slice The slice currently being displayed.
* @property {object} canvas Reference to the canvas area used for drawing.
* @property {object} context The 2D context of the canvas. 
* @property {object} image_center The **x** and **y** coordinates of the
*   center of the slice currently being displayed.
* @property {number} zoom The current zoom level of the panel. 
* @property {object} cursor The current **x** and **y** coordinates of the cursor. 
* @property {object} mouse The current **x** and **y** coordinates of the mouse. 
* @description
* Object representing an individual canvas panel.
*/
(function() {
  "use strict";
    
  var panel_proto = {

    /**
    * @doc function
    * @name panel.panel:updateCursor
    * @description
    * Update the panel cursor based on the current position with the given volume.
    */
    updateCursor: function() {
      var volume = this.volume;
      var slice = this.slice;
      var origin = this.getImageOrigin();
      if (volume && slice) {
        this.cursor.x = (volume.position[slice.width_space.name] * Math.abs(slice.width_space.step) * this.zoom) + origin.x;
        this.cursor.y = (slice.height_space.space_length - volume.position[slice.height_space.name]) * Math.abs(slice.height_space.step) * this.zoom  + origin.y;
      }
    },

    /**
    * @doc function
    * @name panel.panel:followCursor
    * @param {object} cursor The cursor to follow.
    * @description
    * Will translate the image by the same amount that the cursor has moved since
    * this method was last called.
    */
    followCursor: function(cursor) {
      var dx = cursor.x - this.last_cursor.x;
      var dy = cursor.y - this.last_cursor.y;
      this.image_center.x += dx;
      this.image_center.y += dy;
      this.cursor.x += dx;
      this.cursor.y += dy;
      this.last_cursor.x = cursor.x;
      this.last_cursor.y = cursor.y;
    },

    /**
    * @doc function
    * @name panel.panel:reset
    * @description
    * Reset image to it's original position and zoom level.
    */
    reset: function() {
      this.zoom = 1;
      this.image_center.x = this.canvas.width / 2;
      this.image_center.y = this.canvas.height / 2;
    },
    
    /**
    * @doc function
    * @name panel.panel:getImageOrigin
    * @returns {object} Returns an object containing the **x** and **y** coordinates of the
    * top-left corner of the currently displayed slice on the panel.
    * @description
    * Get the coordinates of the top-left corner of the slice currently being displayed.
    */
    getImageOrigin: function() {
      return {
        x: this.image_center.x - this.slice.image.width / 2,
        y: this.image_center.y - this.slice.image.height / 2
      };
    },
    
    /**
    * @doc function
    * @name panel.panel:drawSlice
    * @description
    * Draw the displays current slice to the canvas.
    */
    drawSlice: function() {
      var img = this.slice.image;
      var origin = this.getImageOrigin();
      this.context.putImageData(img, origin.x, origin.y);
    },
    
    /**
    * @doc function
    * @name panel.panel:drawCursor
    * @param {string} color The cursor color.
    * @description
    * Draw the cursor at its current position on the canvas.
    */
    drawCursor: function(color) {
      var context = this.context;
      var zoom = this.zoom;
      var length = 8;
      color = color || "#FF0000";
      
      context.save();
      
      context.strokeStyle = color;
      context.translate(this.cursor.x, this.cursor.y);
      context.scale(zoom, zoom);
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0, -length);
      context.lineTo(0, -2);
      context.moveTo(0, 2);
      context.lineTo(0, length);
      context.moveTo(-length, 0);
      context.lineTo(-2, 0);
      context.moveTo(2, 0);
      context.lineTo(length, 0);
      context.stroke();
      
      context.restore();
    }
  };

  /**
  * @doc function
  * @name Volume Viewer.static methods:createPanel
  * @param {object} options Options used to create the panel.
  * @returns {object} Panel object used to control display of a slice.
  * 
  * @description
  * Factory function to produce the panel object used to control the 
  * display of a slice.
  */
  BrainBrowser.VolumeViewer.createPanel = function(options) {
    options = options || {};

    var defaults = {
      cursor: {
        x: 0,
        y: 0
      },
      last_cursor: {
        x: 0,
        y: 0
      },
      image_center: {
        x: 0,
        y: 0
      },
      zoom: 1
    };

    var panel = Object.create(panel_proto);
    
    Object.keys(defaults).forEach(function(k) {
      panel[k] = defaults[k];
    });

    Object.keys(options).forEach(function(k) {
      panel[k] = options[k];
    });

    return panel;
  };

})();

