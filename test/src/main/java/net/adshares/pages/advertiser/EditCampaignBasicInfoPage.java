package net.adshares.pages.advertiser;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

/**
 * Page for entering basic campaign data (first stage of campaign editing).
 */
public class EditCampaignBasicInfoPage {
    /**
     * Date pattern used on basic information campaign page. It is used as pattern of DateTimeFormatter.
     */
    private static final String DATE_PATTERN = "M/d/uuuu";

    @FindBy(id = "campaignName")
    private WebElement campaignNameInput;
    @FindBy(id = "campaignTargetURL")
    private WebElement campaignTargetURLInput;
    @FindBy(id = "campaignBidStrategy")
    private WebElement campaignBidStrategySelect;
    @FindBy(css = "body > div.cdk-overlay-container mat-option")
    private List<WebElement> campaignBidStrategyList;
    @FindBy(id = "campaignBidValue")
    private WebElement campaignBidValueInput;
    @FindBy(id = "campaignBudget")
    private WebElement campaignBudgetInput;
    /**
     * Two element list of date input. First element is for start, second is for end of campaign.
     */
    @FindBy(css = CSS_DATE_INPUT_LIST)
    private List<WebElement> campaignDateInputList;
    @FindBy(css = CSS_BACK_BUTTON)
    private WebElement backButton;
    @FindBy(css = CSS_SAVE_BUTTON)
    private WebElement saveButton;


    /**
     * CSS selector for form object
     */
    private static final String CSS_FORM = "section.campaign-edit-basic-information form";
    /**
     * CSS Selector for date inputs
     */
    private static final String CSS_DATE_INPUT_LIST = CSS_FORM + " > div:nth-child(1) > div:nth-of-type(5) > div input";
    /**
     * CSS Selector for buttons section
     */
    private static final String CSS_BUTTONS_DIV = CSS_FORM + " > div:nth-child(2)";
    /**
     * CSS selector for Back button
     */
    private static final String CSS_BACK_BUTTON = CSS_BUTTONS_DIV + " > a";
    /**
     * CSS selector for Save button
     */
    private static final String CSS_SAVE_BUTTON = CSS_BUTTONS_DIV + " > button";


    private WebDriver driver;
    private WebDriverWait wait;

    public EditCampaignBasicInfoPage(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 10);
        PageFactory.initElements(driver, this);
    }

    public void fillInForm(CampaignBasicInfo campInfo) {
        wait.until(ExpectedConditions.visibilityOf(campaignNameInput));

        campaignNameInput.sendKeys(campInfo.getName());
        campaignTargetURLInput.sendKeys(campInfo.getTargetUrl());

        campaignBidStrategySelect.click();
        wait.until(ExpectedConditions.visibilityOf(campaignBidStrategyList.get(0)));

        // select bid strategy by text
        for (WebElement we : campaignBidStrategyList) {
            String text = we.findElement(By.tagName("span")).getText();
            if (campInfo.getBidStrategy().equals(text)) {
                we.click();
                break;
            }
        }

        campaignBidValueInput.sendKeys(campInfo.getBidValue());
        campaignBudgetInput.sendKeys(campInfo.getBudget());

        // set date
        WebElement campaignStartDateInput = campaignDateInputList.get(0);
        clearInput(campaignStartDateInput);


        final LocalDate startDate = campInfo.getStartDate();
        final LocalDate endDate = campInfo.getEndDate();
        final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_PATTERN, Locale.US);
        String startDateAsString = startDate.format(formatter);
        campaignStartDateInput.sendKeys(startDateAsString);

        WebElement campaignEndDateInput = campaignDateInputList.get(1);
        if (endDate != null) {
            // end date should be input only, if it is defined
            String endDateAsString = endDate.format(formatter);
            campaignEndDateInput.sendKeys(endDateAsString);
        }
    }

    /**
     * Removes all characters from input.
     *
     * @param webElementInput input element
     */
    private void clearInput(WebElement webElementInput) {
        // Characters are deleted by backspace.
        String value = webElementInput.getAttribute("value");
        int length = value.length();
        if (length > 0) {
            // backspace ascii code is 8
            char bsChar = (char) 8;
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < length; i++) {
                sb.append(bsChar);
            }
            webElementInput.sendKeys(sb);
        }
    }

    public void saveData() {
        wait.until(ExpectedConditions.visibilityOf(saveButton));
        saveButton.click();
    }

    public void goBack() {
        wait.until(ExpectedConditions.visibilityOf(backButton));
        backButton.click();

        driver.switchTo().alert().accept();
    }

}
