package pl.adshares.adpanel.tools;
import java.util.HashMap;

public class RandomPage {

  private static HashMap store;
  private static HashMap store2;
  private static HashMap id;

  public static void create() {
    store = new HashMap();
    store2 = new HashMap();
  }
  public static void createId() {
    id = new HashMap();
  }

  public static void store(String name, String value) {
    store.put(name, value);
  }
  public static void store2(String name, String value) {
    store2.put(name, value);
  }
  public static void id(String name, int value) {
    id.put(name, value);
  }

  public static Object getFromStore(String name) {
    return store.get(name);
  }
  public static Object getFromStore2(String name) {
    return store2.get(name);
  }
  public static Object getFromId(String name) {
    return id.get(name);
  }
}
