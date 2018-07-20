package pl.adshares.adpanel.data.campaign;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

public class CampaignBasicInfo {
  private final String name;
  private final String targetUrl;
  private final String bidStrategy;
  private final String bidValue;
  private final String budget;
  private final LocalDate startDate;
  private final LocalDate endDate;


  public CampaignBasicInfo(String name, String targetUrl, String bidStrategy, String bidValue, String budget, LocalDate startDate) {
    this(name, targetUrl, bidStrategy, bidValue, budget, startDate, null);
  }

  public CampaignBasicInfo(String name, String targetUrl, String bidStrategy, String bidValue, String budget, LocalDate startDate, LocalDate endDate) {
    this.name = name;
    this.targetUrl = targetUrl;
    this.bidStrategy = bidStrategy;
    this.bidValue = bidValue;
    this.budget = budget;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public String getName() {
    return name;
  }

  public String getTargetUrl() {
    return targetUrl;
  }

  public String getBidStrategy() {
    return bidStrategy;
  }

  public String getBidValue() {
    return bidValue;
  }

  public String getBudget() {
    return budget;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  /**
   * @return campaign end date or <b>null</b> if end is not defined
   */
  public LocalDate getEndDate() {
    return endDate;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    CampaignBasicInfo that = (CampaignBasicInfo) o;
    return Objects.equals(getName(), that.getName()) &&
      Objects.equals(getTargetUrl(), that.getTargetUrl()) &&
      Objects.equals(getBidStrategy(), that.getBidStrategy()) &&
      (new BigDecimal(getBidValue()).compareTo(new BigDecimal(that.getBidValue())) == 0) &&
      (new BigDecimal(getBudget()).compareTo(new BigDecimal(that.getBudget())) == 0) &&
      getStartDate().isEqual(that.getStartDate()) &&
      ((getEndDate() == null && that.getEndDate() == null) || (getEndDate() != null && that.getEndDate() != null && getEndDate().isEqual(that.getEndDate())));
  }

  @Override
  public int hashCode() {

    return Objects.hash(getName(), getTargetUrl(), getBidStrategy(), getBidValue(), getBudget(), getStartDate(), getEndDate());
  }
}
