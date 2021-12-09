<?php

namespace Drupal\custom_clock;

use Drupal\Core\Datetime\DateFormatter;

 /**
 * Class ClockDateFormatter
 */
class ClockDateFormatter {

  /**
   * The date formatter service.
   */
  protected $date_formatter;

  /**
   * Constructs DateFormatter object.
   */
  public function __construct(DateFormatter $date_formatter) {
    $this->date_formatter = $date_formatter;
  }

  /**
   * {@inheritdoc}
   */
  public function getDateFormatter() {
    return $this->date_formatter;
  }

}
