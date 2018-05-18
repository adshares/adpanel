package net.adshares.tools;

import net.adshares.enums.Properties;

import java.io.File;
import java.util.Map;
import java.util.TreeMap;

public class Structure {
  public static final String CONFIG_PROPERTIES = "tests/ui/resources/user.xml";

  public Structure() {
    try {
      this.createConfigFile();
//      new File(CONFIG_PROPERTIES).createNewFile();
//    } catch (FileNotFoundException e) {
//      System.out.println("Nie znaleziono pliku: " + e.getMessage());
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  private void createConfigFile() {
    Map<String, String> prop = new TreeMap<>();
    prop.put(Properties.EMAIL, "");
    prop.put(Properties.PASSWORD, "");


    File file = new File(CONFIG_PROPERTIES);
    boolean exists = file.exists();
    if (!exists) {
      file.getParentFile().mkdirs();
      new Xml().createXml(file, prop);
      System.out.println("Created: " + CONFIG_PROPERTIES);
    }
  }

  public static void main(String[] args) {
    new Structure();
  }

}
