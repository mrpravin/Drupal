/**
 * @file
 * Gets the date format related parameters from PHP and formats the date according
 * to the PHP date formatters.
 */
(function ($) {

  'use strict';

  Drupal.behaviors.clockDisplay = {
    attach: function (context, drupalSettings) {

      var date = new Date();
      // create month array
      var monthNames = [];
      monthNames[1] = {};
      monthNames[1]['short'] = Drupal.t('Jan');
      monthNames[2] = {};
      monthNames[2]['short'] = Drupal.t('Feb');
      monthNames[3] = {};
      monthNames[3]['short'] = Drupal.t('Mar');
      monthNames[4] = {};
      monthNames[4]['short'] = Drupal.t('Apr');
      monthNames[5] = {};
      monthNames[5]['short'] = Drupal.t('May');
      monthNames[6] = {};
      monthNames[6]['short'] = Drupal.t('Jun');
      monthNames[7] = {};
      monthNames[7]['short'] = Drupal.t('Jul');
      monthNames[8] = {};
      monthNames[8]['short'] = Drupal.t('Aug');
      monthNames[9] = {};
      monthNames[9]['short'] = Drupal.t('Sep');
      monthNames[10] = {};
      monthNames[10]['short'] = Drupal.t('Oct');
      monthNames[11] = {};
      monthNames[11]['short'] = Drupal.t('Nov');
      monthNames[12] = {};
      monthNames[12]['short'] = Drupal.t('Dec');

      var dateFormat = drupalSettings.date_format;
      //var clock = formatDate(date, dateFormat, monthNames);
      window.setInterval(function () {
        // Add 1 second (1000 milliseconds) to the time.
        var clockTimestamp = date.getTime();
        clockTimestamp = clockTimestamp + 1000;
        date = new Date(clockTimestamp);

        // Format the clock.
        var clock = formatDate(date, dateFormat, monthNames);
        $('div.clock').html(clock);
      }, 1000);
    }
  };

})(jQuery);

/**
 * Formats a date into a PHP date string.
 *
 * @param {String} date
 *   A date object.
 * @param {String} dateFormat
 *   A string. See http://php.net/date for possible values.
 * @param {String} monthNames
 *   An array of month names keyed by the numbers 1-12. Each value should in turn
 *   be an array keyed 'long' and 'short' for the long respective the short
 *   month names.
 *
 * @return {String}
 *   A formatted date string.
 */
function formatDate(date, dateFormat, monthNames) {

  'use strict';

  // Initialize the 'formattedDate' variable for later use.
  var formattedDate = '';
  var dayOfMonthAppend = '';

  // Prepare variables for the format conversion.
  // Year-related.
  var year = date.getFullYear();
  var yearShort = year % 100;
  var leapYear = '';
  // Calculate whether it is a leap year or not. Years that are multiples of 4
  // are leap years, while multiples of 100 are not, but multiples of 400 are.
  year = date.getFullYear();
  if (((year % 4) === 0) && ((year % 100) !== 0) || ((year % 400) === 0)) {
    leapYear = '1';
  }
  else {
    leapYear = '0';
  }

  // Month-related.
  var month = date.getMonth();
  // JavaScript starts counting the months with 0 instead of 1.
  month++;
  var monthLeadingZero = ((month < 10) ? '0' + month : month);
  var monthShortName = monthNames[month]['short'];
  var day = date.getDate();
  var dayLeadingZero = ((day < 10) ? '0' + day : day);
  switch (day) {
    case 1:
    case 21:
    case 31:
      dayOfMonthAppend = Drupal.t('st');
      break;

    case 2:
    case 22:
      dayOfMonthAppend = Drupal.t('nd');
      break;

    case 3:
    case 23:
      dayOfMonthAppend = Drupal.t('rd');
      break;

    default:
      dayOfMonthAppend = Drupal.t('th');
      break;
  }
  // Create an array containing month names and lengths.
  var months = [];
  months[1] = 31;
  months[2] = ((leapYear === 1) ? 29 : 28);
  months[3] = 31;
  months[4] = 30;
  months[5] = 31;
  months[6] = 30;
  months[7] = 31;
  months[8] = 31;
  months[9] = 30;
  months[10] = 31;
  months[11] = 30;
  months[12] = 31;
  // To calculate the days of the year, iterate through all passed months and then add the current days of the month.
  var daysOfYear = 0;
  for (var m = 1; m < month; m++) {
    daysOfYear += months[m];
  }
  daysOfYear += day;

  // Hour-related.
  var hours = date.getHours();
  var hoursLeadingZero = ((hours < 10) ? '0' + hours : hours);
  var hoursTwelve = '';
  if (hours === 0) {
    hoursTwelve = (hours + 12);
  }
  else if (hours > 12) {
    hoursTwelve = (hours - 12);
  }
  else {
    hoursTwelve = hours;
  }
  var hoursTwelveLeadingZero = ((hoursTwelve < 10) ? '0' + hoursTwelve : hoursTwelve);

  // Minute-related.
  var minutes = date.getMinutes();
  var minutesLeadingZero = ((minutes < 10) ? '0' + minutes : minutes);

  // Turn the date format string into an array so each character has its own key.
  dateFormat = dateFormat.split('');

  // Perform the date format conversion for a character.
  for (var i = 0; i < dateFormat.length; i++) {
    switch (dateFormat[i]) {
      // 'AM' or 'PM' depending on the time of day.
      case 'A':
        formattedDate += ((hours >= 12) ? Drupal.t('PM') : Drupal.t('AM'));
        break;

      // Hours in 12-hour format, '1' - '12'.
      case 'g':
        formattedDate += hoursTwelve;
        break;

      // Hours in 24-hour format, '0' - '23'.
      case 'G':
        formattedDate += hours;
        break;

      // Hours in 12-hour format with leading zero, '01' - '12'.
      case 'h':
        formattedDate += hoursTwelveLeadingZero;
        break;

      // Hours in 24-hour format with leading zero, '00' - '23'.
      case 'H':
        formattedDate += hoursLeadingZero;
        break;

      // Minutes with leading zero, '00' - '59'.
      case 'i':
        formattedDate += minutesLeadingZero;
        break;

      // Daylight Savings Time, '1' or '0'.
      case 'I':
        formattedDate += daylightSavingsTime;
        break;

      // Day of month, '1' - '31'.
      case 'j':
        formattedDate += day;
        break;

      // Number of month with leading zero, '01' - '12'.
      case 'm':
        formattedDate += monthLeadingZero;
        break;

      // Short name of month, e.g. 'Jan'.
      case 'M':
        formattedDate += monthShortName;
        break;

      // Appendage for the day of month, e.g. 'st' if the day is '1'.
      case 'S':
        formattedDate += dayOfMonthAppend;
        break;

      // Year, e.g. '2001'.
      case 'Y':
        formattedDate += year;
        break;

      // Short year, e.g. '01'.
      case 'y':
        formattedDate += yearShort;
        break;

      // If the character is not a date formatter, just add it to the output.
      default:
        formattedDate += dateFormat[i];
        break;
    }
  }
  return formattedDate;
}
